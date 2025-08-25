'use server';
/**
 * @fileOverview A flow for generating inspiration from a single word.
 *
 * - generateInspiration - A function that generates inspirational paragraphs.
 * - GenerateInspirationInput - The input type for the generateInspiration function.
 * - GenerateInspirationOutput - The return type for the generateInspiration function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInspirationInputSchema = z.object({
  word: z.string().describe('The word to generate inspiration from.'),
});
export type GenerateInspirationInput = z.infer<typeof GenerateInspirationInputSchema>;

const GenerateInspirationOutputSchema = z.object({
  paragraphs: z
    .array(z.string())
    .min(5)
    .describe('An array of at least 5 inspirational paragraphs based on the word.'),
});
export type GenerateInspirationOutput = z.infer<typeof GenerateInspirationOutputSchema>;

export async function generateInspiration(
  input: GenerateInspirationInput
): Promise<GenerateInspirationOutput> {
  return generateInspirationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInspirationPrompt',
  input: {schema: GenerateInspirationInputSchema},
  output: {schema: GenerateInspirationOutputSchema},
  model: 'googleai/gemini-1.5-flash-latest',
  prompt: `You are Plume Sonore, a creative and inspiring muse for poets, slammers, and rappers.
A user has provided a single word: "{{word}}".
Your task is to expand on this word to generate at least five distinct paragraphs of inspirational text. Each paragraph should explore a different facet, metaphor, or story related to the word, providing rich imagery and ideas to spark creativity.
The tone should be evocative, poetic, and encouraging.
Return the paragraphs as a JSON array.`,
});

const generateInspirationFlow = ai.defineFlow(
  {
    name: 'generateInspirationFlow',
    inputSchema: GenerateInspirationInputSchema,
    outputSchema: GenerateInspirationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
