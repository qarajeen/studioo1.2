
'use server';
/**
 * @fileOverview A flow for saving a quote from the pricing calculator to a data store.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { appendToSheet } from '@/services/google-sheets';
import { SaveQuoteInputSchema } from '@/components/landing/quote-calculator/types';
import type { SaveQuoteInput } from '@/components/landing/quote-calculator/types';

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
