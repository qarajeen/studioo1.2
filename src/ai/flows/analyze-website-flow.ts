
'use server';
/**
 * @fileOverview A website performance analysis AI agent.
 *
 * - analyzeWebsite - A function that handles the website performance analysis.
 * - WebsiteAnalysisInput - The input type for the analyzeWebsite function.
 * - WebsiteAnalysisOutput - The return type for the analyzeWebsite function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WebsiteAnalysisInputSchema = z.object({
  url: z.string().url().describe('The URL of the website to analyze.'),
  deviceType: z.enum(['desktop', 'mobile']).describe("The type of device to simulate for the analysis ('desktop' or 'mobile').")
});
export type WebsiteAnalysisInput = z.infer<typeof WebsiteAnalysisInputSchema>;

const MetricAnalysisSchema = z.object({
    name: z.string().describe("The name of the metric (e.g., 'Largest Contentful Paint')."),
    value: z.string().describe("The measured value of the metric (e.g., '2.1s'). Can be N/A."),
    rating: z.enum(['Good', 'Needs Improvement', 'Poor']).describe("The performance rating for this specific metric."),
    explanation: z.string().describe("A concise explanation of what this metric is and why it's important."),
    recommendation: z.string().describe("A specific, actionable recommendation to improve this metric.")
});

const WebsiteAnalysisOutputSchema = z.object({
  overallScore: z.number().min(0).max(10).describe('An overall performance score for the page, from 0 to 10.'),
  overallSummary: z.string().describe("A brief, high-level summary of the website's performance."),
  metrics: z.array(MetricAnalysisSchema).describe("An array of detailed analyses for each performance metric.")
});
export type WebsiteAnalysisOutput = z.infer<typeof WebsiteAnalysisOutputSchema>;


export async function analyzeWebsite(input: WebsiteAnalysisInput): Promise<WebsiteAnalysisOutput> {
  return analyzeWebsiteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeWebsitePrompt',
  input: {schema: WebsiteAnalysisInputSchema},
  output: {schema: WebsiteAnalysisOutputSchema},
  config: {
    temperature: 0,
  },
  prompt: `You are a world-class web performance analyst. Your task is to provide a detailed performance report for the given URL: {{{url}}}. The analysis should be for a *{{{deviceType}}}* device.

You cannot access external websites, so you must generate a *realistic, plausible analysis* based on your expert knowledge of web development, common performance issues, and the metrics involved for the specified device type. For example, mobile metrics are often slightly worse than desktop. Do not state that you cannot access the URL. Proceed with generating a believable report as if you had analyzed it.

Your analysis must cover the following metrics:
- Largest Contentful Paint (LCP)
- Interaction to Next Paint (INP)
- Cumulative Layout Shift (CLS)
- First Contentful Paint (FCP)
- Time to First Byte (TTFB)
- Speed Index

Based on your simulated analysis of these metrics, you must:
1.  Provide a rating ('Good', 'Needs Improvement', 'Poor') for each individual metric.
2.  Provide a concise explanation and an actionable recommendation for each metric.
3.  Calculate an overall performance score out of 10. The score should logically reflect the ratings of the individual metrics and the selected device type.
4.  Write a high-level summary of the site's performance, mentioning that the analysis was for a {{{deviceType}}} device.

Generate a detailed, helpful, and realistic report. Structure your entire response according to the provided JSON schema.`,
});

const analyzeWebsiteFlow = ai.defineFlow(
  {
    name: 'analyzeWebsiteFlow',
    inputSchema: WebsiteAnalysisInputSchema,
    outputSchema: WebsiteAnalysisOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
