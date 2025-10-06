
'use server';

import { google } from 'googleapis';
import type { SaveQuoteInput } from '@/components/landing/quote-calculator/types';

const SPREADSHEET_ID = '10YHrE5cRsQVj5lhUWWLO8HYmxDUoYUy5hgGuJj3layI';
const SHEET_NAME = 'Sheet1'; // Make sure this is the name of your sheet

/**
 * Appends a quote to a Google Sheet.
 * @param quote The quote data to append.
 * @returns A promise that resolves when the data has been appended.
 */
export async function appendToSheet(quote: SaveQuoteİnput): Promise<void> {
  const credentials = process.env.GOOGLE_SHEETS_CREDENTIALS;
  if (!credentials) {
    console.error('GOOGLE_SHEETS_CREDENTIALS environment variable not set.');
    throw new Error('Server configuration error: Google Sheets credentials not found.');
  }

  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(credentials),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  const breakdownText = quote.breakdown.map(item => `${item.name}: ${item.price}`).join('\n');

  const values = [
    [
      new Date().toISOString(),
      quote.name,
      quote.email,
      quote.phone,
      quote.serviceType,
      quote.subType,
      quote.total,
      breakdownText,
      quote.message || '',
    ],
  ];

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A1`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values,
      },
    });
    console.log('Appended data to Google Sheet.');
  } catch (err) {
    console.error('Error appending to Google Sheet:', err);
    throw new Error('Failed to save quote to Google Sheet.');
  }
}
