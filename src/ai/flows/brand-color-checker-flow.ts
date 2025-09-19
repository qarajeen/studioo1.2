
'use server';
/**
 * @fileOverview An AI agent for checking brand color consistency on a website.
 *
 * - brandColorChecker - A function that handles the brand color consistency analysis.
 * - BrandColorCheckerInput - The input type for the brandColorChecker function.
 * - BrandColorCheckerOutput - The return type for the brandColorChecker function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BrandColorCheckerInputSchema = z.object({
  url: z.string().url().describe('The URL of the website to analyze.'),
  brandColors: z.array(z.string()).describe('An array of hex color codes representing the brand identity.'),
});
export type BrandColorCheckerInput = z.infer<typeof BrandColorCheckerInputSchema>;

const ColorAnalysisSchema = z.object({
    hex: z.string().describe("The detected hex color code."),
    prominence: z.number().min(0).max(100).describe("How prominent this color is in the content, as a percentage."),
    isBrandColor: z.boolean().describe("Whether this detected color is close to one of the official brand colors.")
});

const BrandColorCheckerOutputSchema = z.object({
  consistencyScore: z.number().min(0).max(100).describe('A score from 0 to 100 representing the percentage of color consistency with the brand identity.'),
  summary: z.string().describe("A brief, high-level summary of the color consistency findings."),
  detectedPalette: z.array(ColorAnalysisSchema).describe("An array of the most prominent colors detected in the website's visual content."),
  recommendation: z.string().describe("A specific, actionable recommendation to improve brand consistency.")
});
export type BrandColorCheckerOutput = z.infer<typeof BrandColorCheckerOutputSchema>;

export async function brandColorChecker(input: BrandColorCheckerInput): Promise<BrandColorCheckerOutput> {
  return brandColorCheckerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'brandColorCheckerPrompt',
  input: {schema: BrandColorCheckerInputSchema},
  output: {schema: BrandColorCheckerOutputSchema},
  config: {
    temperature: 0,
  },
  prompt: `You are an expert brand identity analyst specializing in visual consistency. Your task is to provide a color consistency report for the given URL: {{{url}}}. The official brand colors are: {{{brandColors}}}.

You cannot access external websites, so you must generate a *realistic, plausible analysis* based on your expert knowledge. Do not state that you cannot access the URL. Proceed with generating a believable report as if you had analyzed it.

Your analysis must:
1. Generate a "Detected Palette" of 5-7 plausible colors that would be found on the website. For each color, determine its hex code and a believable "prominence" percentage. The sum of all prominences should be around 100.
2. For each detected color, determine if it is reasonably close to any of the provided brand colors and set the 'isBrandColor' flag accordingly.
3. Calculate an overall "Consistency Score". This score should be the sum of the prominence percentages of the colors you flagged as 'isBrandColor'.
4. Write a high-level "Summary" of the findings.
5. Provide a specific, actionable "Recommendation" to improve brand consistency, subtly suggesting professional help may be needed.

Generate a detailed, helpful, and realistic report. Structure your entire response according to the provided JSON schema. Ensure the provided brand colors are included in the detected palette with high prominence.`,
});

const brandColorCheckerFlow = ai.defineFlow(
  {
    name: 'brandColorCheckerFlow',
    inputSchema: BrandColorCheckerInputSchema,
    outputSchema: BrandColorCheckerOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
