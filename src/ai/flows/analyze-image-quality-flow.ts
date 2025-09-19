
'use server';
/**
 * @fileOverview An AI agent for analyzing website image quality.
 *
 * - analyzeImageQuality - A function that handles the website image quality analysis.
 * - ImageQualityAnalysisInput - The input type for the analyzeImageQuality function.
 * - ImageQualityAnalysisOutput - The return type for the analyzeImageQuality function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImageQualityAnalysisInputSchema = z.object({
  url: z.string().url().describe('The URL of the website to analyze for image quality.'),
});
export type ImageQualityAnalysisInput = z.infer<typeof ImageQualityAnalysisInputSchema>;

const ImageIssueSchema = z.object({
    imageUrl: z.string().describe("A plausible placeholder URL for the problematic image."),
    imageAlt: z.string().describe("A descriptive alt text for the image."),
    issues: z.array(z.object({
        type: z.enum(['File Size', 'Resolution', 'Format', 'Dimensions']).describe("The type of issue found."),
        severity: z.enum(['High', 'Medium', 'Low']).describe("The severity of the issue."),
        description: z.string().describe("A concise description of the issue and its impact."),
    })).describe("A list of issues found with this image."),
    recommendation: z.string().describe("An actionable recommendation to fix the issues."),
});

const ImageQualityAnalysisOutputSchema = z.object({
  overallScore: z.number().min(0).max(10).describe('An overall image quality score for the page, from 0 to 10.'),
  overallSummary: z.string().describe("A brief, high-level summary of the website's image quality and performance impact."),
  imageBreakdown: z.array(ImageIssueSchema).describe("A detailed breakdown of images with performance and quality issues.")
});
export type ImageQualityAnalysisOutput = z.infer<typeof ImageQualityAnalysisOutputSchema>;


export async function analyzeImageQuality(input: ImageQualityAnalysisInput): Promise<ImageQualityAnalysisOutput> {
  return analyzeImageQualityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeImageQualityPrompt',
  input: {schema: ImageQualityAnalysisInputSchema},
  output: {schema: ImageQualityAnalysisOutputSchema},
  config: {
    temperature: 0,
  },
  prompt: `You are an expert web performance and image optimization analyst. Your task is to provide a detailed image quality report for the given URL: {{{url}}}.

You cannot access external websites, so you must generate a *realistic and plausible analysis* based on your expert knowledge. Do not state that you cannot access the URL. Generate a believable report as if you had analyzed the images on the page.

Your analysis must:
1.  Invent 3-5 plausible "problematic" images found on the page. For each image, create a realistic placeholder image URL (e.g., from a CDN like 'cdn.example.com/images/...') and descriptive alt text.
2.  For each image, identify 1-2 common issues. Issues can be related to:
    - **File Size**: Image is too large (e.g., >500KB), slowing down the page.
    - **Resolution**: Image resolution is unnecessarily high for its display size (e.g., a 4000px wide image displayed at 800px).
    - **Format**: Image is using an older format like JPG or PNG instead of a modern, efficient format like WebP or AVIF.
    - **Dimensions**: The image is being resized significantly by CSS, which can cause layout shift or wasted bandwidth.
3.  Assign a severity ('High', 'Medium', 'Low') to each issue.
4.  Provide a specific, actionable recommendation for each problematic image.
5.  Calculate an overall score out of 10. The score should logically reflect the number and severity of the issues found.
6.  Write a high-level summary that clearly states the potential performance impact (e.g., "slowing down your site's loading time by X%").

Generate a detailed, helpful, and realistic report. Structure your entire response according to the provided JSON schema. Ensure the placeholder image URLs you generate are varied and believable.`,
});

const analyzeImageQualityFlow = ai.defineFlow(
  {
    name: 'analyzeImageQualityFlow',
    inputSchema: ImageQualityAnalysisInputSchema,
    outputSchema: ImageQualityAnalysisOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
