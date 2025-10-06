
'use server';
/**
 * @fileOverview A flow for saving a quote from the pricing calculator to a data store.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { appendToSheet } from '@/services/google-sheets';

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

// Tool to save the data to Google Sheets.
const saveToSheetTool = ai.defineTool(
  {
    name: 'saveToSheet',
    description: 'Saves the quote data to a Google Sheet.',
    inputSchema: SaveQuoteInputSchema,
    outputSchema: z.void(),
  },
  async (input) => {
    await appendToSheet(input);
  }
);


// This is the main flow function.
export const saveQuoteFlow = ai.defineFlow(
  {
    name: 'saveQuoteFlow',
    inputSchema: SaveQuoteInputSchema,
    outputSchema: z.object({ success: z.boolean() }),
    tools: [saveToSheetTool]
  },
  async (input) => {
    
    await saveToSheetTool(input);
    
    return { success: true };
  }
);

export async function saveQuote(input: SaveQuoteInput): Promise<{ success: boolean }> {
    return await saveQuoteFlow(input);
}
