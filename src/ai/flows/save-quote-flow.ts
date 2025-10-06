'use server';
/**
 * @fileOverview A flow for saving a quote from the pricing calculator to a data store.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Defines the input data structure for the quote.
export const SaveQuoteInputSchema = z.object({
    serviceType: z.string().describe("The main service selected (e.g., Photography, Video)."),
    subType: z.string().describe("The specific sub-service chosen (e.g., Event, Corporate)."),
    total: z.number().describe("The total estimated price of the quote."),
    name: z.string().describe("The customer's name."),
    email: z.string().email().describe("The customer's email address."),
    phone: z.string().describe("The customer's phone number."),
    message: z.string().optional().describe("An optional message from the customer."),
    breakdown: z.array(z.object({
        name: z.string(),
        price: z.union([z.string(), z.number()]),
    })).describe("A detailed breakdown of the quote items and their prices."),
});
export type SaveQuoteInput = z.infer<typeof SaveQuoteInputSchema>;

// This is the main flow function. For now, it just logs the input.
// In the next step, we will add the logic to send this data to Google Sheets.
export const saveQuoteFlow = ai.defineFlow(
  {
    name: 'saveQuoteFlow',
    inputSchema: SaveQuoteInputSchema,
    outputSchema: z.object({ success: z.boolean() }),
  },
  async (input) => {
    console.log('Received quote to save:', JSON.stringify(input, null, 2));
    
    // TODO: Add tool to save to Google Sheet.
    
    return { success: true };
  }
);

export async function saveQuote(input: SaveQuoteInput): Promise<{ success: boolean }> {
    return await saveQuoteFlow(input);
}
