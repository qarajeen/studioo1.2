
'use server';

import { google } from 'googleapis';
import type { SaveQuoteInput } from '@/components/landing/quote-calculator/types';

const SPREADSHEET_ID = '10YHrE5cRsQVj5lhUWWLO8HYmxDUoYUy5hgGuJj3layI';
const SHEET_NAME = 'Quotes'; // Make sure this is the name of your sheet

/**
 * Appends a quote to a Google Sheet.
 * @param quote The quote data to append.
 * @returns A promise that resolves when the data has been appended.
 */
export async function appendToSheet(quote: SaveQuoteInput): Promise<void> {
  const credentialsString = process.env.GOOGLE_SHEETS_CREDENTIALS;
  if (!credentialsString) {
    console.error('GOOGLE_SHEETS_CREDENTIALS environment variable not set.');
    throw new Error('Server configuration error: Google Sheets credentials not found.');
  }

  let credentials;
  try {
    credentials = JSON.parse(credentialsString);
  } catch (e) {
    console.error('Failed to parse GOOGLE_SHEETS_CREDENTIALS:', e);
    throw new Error('Server configuration error: Google Sheets credentials are not valid JSON.');
  }


  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  const breakdownText = quote.breakdown.map(item => `${item.name}: ${typeof item.price === 'number' ? item.price.toLocaleString() : item.price} AED`).join('\n');

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
  } catch (err: any) {
    console.error('Error appending to Google Sheet:', err);
    // Throw a more specific error message
    const errorMessage = err.message || 'An unknown error occurred.';
    throw new Error(`Failed to save quote to Google Sheet: ${errorMessage}`);
  }
}
