
'use server';
/**
 * @fileOverview An AI agent for converting JPEG images to WEBP format.
 *
 * - jpegToWebp - A function that handles the image conversion.
 * - JpegToWebpInput - The input type for the jpegToWebp function.
 * - JpegToWebpOutput - The return type for the jpegToWebp function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const JpegToWebpInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "A JPEG image, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:image/jpeg;base64,<encoded_data>'."
    ),
});
export type JpegToWebpInput = z.infer<typeof JpegToWebpInputSchema>;

const JpegToWebpOutputSchema = z.object({
  webpDataUri: z.string().describe("The converted WEBP image as a data URI."),
});
export type JpegToWebpOutput = z.infer<typeof JpegToWebpOutputSchema>;

export async function jpegToWebp(input: JpegToWebpInput): Promise<JpegToWebpOutput> {
  return jpegToWebpFlow(input);
}

const jpegToWebpFlow = ai.defineFlow(
  {
    name: 'jpegToWebpFlow',
    inputSchema: JpegToWebpInputSchema,
    outputSchema: JpegToWebpOutputSchema,
  },
  async (input) => {
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-image-preview',
      prompt: [
        { media: { url: input.imageDataUri } },
        { text: 'Convert this image to WEBP format. Return only the converted image.' },
      ],
      config: {
        responseModalities: ['IMAGE'], 
      },
    });

    if (!media?.url) {
      throw new Error('Image conversion failed or returned no media.');
    }

    return { webpDataUri: media.url };
  }
);
