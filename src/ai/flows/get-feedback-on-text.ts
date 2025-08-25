'use server';
/**
 * @fileOverview An AI agent that provides feedback on a text.
 *
 * - getFeedbackOnText - A function that handles the text feedback process.
 * - GetFeedbackOnTextInput - The input type for the getFeedbackOnText function.
 * - GetFeedbackOnTextOutput - The return type for the getFeedbackOnText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetFeedbackOnTextInputSchema = z.object({
  text: z.string().describe('The text to get feedback on.'),
  writingStyle: z.enum(['poetry', 'slam', 'rap']).describe('The writing style of the text.'),
});
export type GetFeedbackOnTextInput = z.infer<typeof GetFeedbackOnTextInputSchema>;

const GetFeedbackOnTextOutputSchema = z.object({
  feedback: z.string().describe('The AI-generated feedback on the text.'),
  suggestions: z.string().describe('AI-driven suggestions for improvement of the text.'),
});
export type GetFeedbackOnTextOutput = z.infer<typeof GetFeedbackOnTextOutputSchema>;

export async function getFeedbackOnText(input: GetFeedbackOnTextInput): Promise<GetFeedbackOnTextOutput> {
  return getFeedbackOnTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getFeedbackOnTextPrompt',
  input: {schema: GetFeedbackOnTextInputSchema},
  output: {schema: GetFeedbackOnTextOutputSchema},
  model: 'googleai/gemini-1.5-flash-latest',
  prompt: `You are an AI assistant designed to provide feedback and suggestions for improving creative writing.

You will receive a text written in a specific style (poetry, slam, or rap) and you will provide feedback focusing on rhyme, rhythm, and stylistic devices.

Text Style: {{{writingStyle}}}
Text: {{{text}}}

Provide detailed feedback and actionable suggestions for improvement in the output.
`,
});

const getFeedbackOnTextFlow = ai.defineFlow(
  {
    name: 'getFeedbackOnTextFlow',
    inputSchema: GetFeedbackOnTextInputSchema,
    outputSchema: GetFeedbackOnTextOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
