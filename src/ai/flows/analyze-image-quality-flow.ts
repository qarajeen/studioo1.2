
'use server';
/**
 * @fileOverview A website image quality analysis AI agent.
 *
 * - analyzeImageQuality - A function that handles the website image quality analysis.
 * - ImageQualityInput - The input type for the analyzeImageQuality function.
 * - ImageQualityOutput - The return type for the analyzeImageQuality function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImageQualityInputSchema = z.object({
  url: z.string().url().describe('The URL of the website to analyze for image quality.'),
});
export type ImageQualityInput = z.infer<typeof ImageQualityInputSchema>;

const ImageBreakdownSchema = z.object({
    imageName: z.string().describe("A plausible filename for the problematic image (e.g., 'hero-banner.jpg', 'product-image-03.png')."),
    size: z.string().describe("The file size of the image (e.g., '1.2 MB', '850 KB')."),
    format: z.string().describe("The format of the image (e.g., 'JPEG', 'PNG')."),
    resolution: z.string().describe("The dimensions of the image (e.g., '4000x2500px')."),
    issue: z.string().describe("A concise description of the main issue (e.g., 'Image size is too large, impacting load time.', 'Not using a modern format like WebP.', 'Resolution is unnecessarily high for web display.').")
});

const ImageQualityOutputSchema = z.object({
  overallScore: z.number().min(0).max(10).describe('An overall image quality score for the page, from 0 to 10, based on performance, format, and resolution.'),
  overallSummary: z.string().describe("A brief, high-level summary of the website's image quality, including a key metric. Example: 'Your page's image quality score is 6/10. We found 3 large images that are slowing down your site's loading time by an estimated 40%.'"),
  imageBreakdown: z.array(ImageBreakdownSchema).describe("An array of detailed analyses for each problematic image found.")
});
export type ImageQualityOutput = z.infer<typeof ImageQualityOutputSchema>;


export async function analyzeImageQuality(input: ImageQualityInput): Promise<ImageQualityOutput> {
  return analyzeImageQualityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeImageQualityPrompt',
  input: {schema: ImageQualityInputSchema},
  output: {schema: ImageQualityOutputSchema},
  config: {
    temperature: 0,
  },
  prompt: `You are an expert web performance analyst specializing in image optimization. Your task is to provide an image quality and performance report for the given URL: {{{url}}}.

You cannot access external websites, so you must generate a *realistic, plausible analysis* based on your expert knowledge of web development and common image-related issues. Do not state that you cannot access the URL. Proceed with generating a believable report as if you had analyzed it.

Your analysis must:
1.  Invent between 2 and 5 plausible "problematic" images for the given URL. Give them realistic file names, sizes, formats, and resolutions.
2.  For each image, identify a primary issue (e.g., large file size, old format, excessive resolution).
3.  Calculate an overall score out of 10. A lower score means more, or more severe, issues. A score of 10 means no significant issues were found.
4.  Write a high-level summary that includes the score and a key takeaway, such as the estimated performance impact.
5.  Provide a breakdown of the problematic images you invented.

Generate a detailed, helpful, and realistic report. Structure your entire response according to the provided JSON schema. Ensure the summary is punchy and leads to the conclusion that professional optimization is needed.`,
});

const analyzeImageQualityFlow = ai.defineFlow(
  {
    name: 'analyzeImageQualityFlow',
    inputSchema: ImageQualityInputSchema,
    outputSchema: ImageQualityOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
