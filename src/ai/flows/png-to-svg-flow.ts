
'use server';
/**
 * @fileOverview An AI agent for converting PNG images to SVG format.
 *
 * - pngToSvg - A function that handles the PNG to SVG conversion.
 * - PngToSvgInput - The input type for the pngToSvg function.
 * - PngToSvgOutput - The return type for the pngToSvg function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PngToSvgInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "A PNG image to be converted to SVG, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:image/png;base64,<encoded_data>'."
    ),
});
export type PngToSvgInput = z.infer<typeof PngToSvgInputSchema>;

const PngToSvgOutputSchema = z.object({
  svgString: z.string().describe("The SVG representation of the input image as a string of SVG markup."),
});
export type PngToSvgOutput = z.infer<typeof PngToSvgOutputSchema>;

export async function pngToSvg(input: PngToSvgInput): Promise<PngToSvgOutput> {
  return pngToSvgFlow(input);
}

const prompt = ai.definePrompt({
  name: 'pngToSvgPrompt',
  input: {schema: PngToSvgInputSchema},
  output: {schema: PngToSvgOutputSchema},
  config: {
    temperature: 0,
  },
  prompt: `You are an expert in graphic design and image vectorization. Your task is to convert the given PNG image into a clean, optimized, and accurate SVG format.

Analyze the provided image and generate a complete SVG markup string that represents it. The SVG should be well-structured and scalable. Do not include any explanation, only the raw SVG string in the output field.

Image for conversion: {{media url=imageDataUri}}`,
});

const pngToSvgFlow = ai.defineFlow(
  {
    name: 'pngToSvgFlow',
    inputSchema: PngToSvgInputSchema,
    outputSchema: PngToSvgOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
