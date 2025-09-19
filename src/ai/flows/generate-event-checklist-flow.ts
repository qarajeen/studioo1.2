
'use server';
/**
 * @fileOverview An AI agent for generating a comprehensive event photography checklist.
 *
 * - generateEventChecklist - A function that generates the checklist content.
 * - EventChecklistOutput - The return type for the generateEventChecklist function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChecklistItemSchema = z.object({
  title: z.string().describe("The concise title of the checklist item."),
  description: z.string().describe("A brief, actionable description or explanation for the item."),
  category: z.enum(['Planning', 'Logistics', 'Creative', 'Technical', 'Post-Event']).describe("The category of the checklist item."),
});

const EventChecklistOutputSchema = z.object({
  sections: z.array(z.object({
      title: z.string().describe("The title of the checklist section (e.g., 'Phase 1: Pre-Event Strategy')."),
      items: z.array(ChecklistItemSchema).describe("An array of checklist items for this section.")
  })).describe("The structured checklist, divided into sections."),
  introduction: z.string().describe("A brief, engaging introduction for the PDF document."),
  conclusion: z.string().describe("A concluding paragraph that subtly promotes Studioo's services and provides a call to action.")
});

export type EventChecklistOutput = z.infer<typeof EventChecklistOutputSchema>;

export async function generateEventChecklist(): Promise<EventChecklistOutput> {
  return generateEventChecklistFlow();
}

const prompt = ai.definePrompt({
  name: 'generateEventChecklistPrompt',
  output: {schema: EventChecklistOutputSchema},
  config: {
    temperature: 0.2, 
  },
  prompt: `You are an expert event producer and photographer at "STUDIOO", a creative production house in Dubai. Your task is to generate the content for "The Ultimate Event Photography Checklist," a premium, two-page PDF aimed at marketing and event managers.

Generate a comprehensive and professional checklist that is genuinely useful. The tone should be expert, helpful, and authoritative.

The output MUST be structured into the following sections, each with at least 5-7 detailed items:
1.  **Phase 1: Pre-Event Strategy & Briefing**: Items related to defining goals, creating a shot list, and briefing the photographer.
2.  **Phase 2: On-Site Logistics & Technical Prep**: Items about location scouting, lighting, credentials, and communication plans.
3.  **Phase 3: During The Event - Capturing The Story**: Items covering key moments, candid shots, branding, and attendee interaction.
4.  **Phase 4: Post-Event Workflow & Delivery**: Items about image selection, editing, delivery timelines, and usage rights.

For each item, provide a title, a short description, and assign it to one of these categories: 'Planning', 'Logistics', 'Creative', 'Technical', 'Post-Event'.

Also, generate:
- A brief, compelling 'introduction' that explains the value of the checklist.
- A strategic 'conclusion' that reinforces STUDIOO's expertise and includes a call to action to book a consultation or visit the website.

Structure your entire response according to the provided JSON schema.
`,
});

const generateEventChecklistFlow = ai.defineFlow(
  {
    name: 'generateEventChecklistFlow',
    outputSchema: EventChecklistOutputSchema,
  },
  async () => {
    const {output} = await prompt({});
    return output!;
  }
);
