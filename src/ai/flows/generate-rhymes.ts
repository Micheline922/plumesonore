// This is a server-side file
'use server';

/**
 * @fileOverview A rhyme generation AI agent.
 *
 * - generateRhymes - A function that handles the rhyme generation process.
 * - GenerateRhymesInput - The input type for the generateRhymes function.
 * - GenerateRhymesOutput - The return type for the generateRhymes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRhymesInputSchema = z.object({
  wordOrPhrase: z.string().describe('The word or phrase to generate rhymes for.'),
});
export type GenerateRhymesInput = z.infer<typeof GenerateRhymesInputSchema>;

const GenerateRhymesOutputSchema = z.object({
  rhymes: z.array(z.string()).describe('An array of rhymes for the given word or phrase.'),
});
export type GenerateRhymesOutput = z.infer<typeof GenerateRhymesOutputSchema>;

export async function generateRhymes(input: GenerateRhymesInput): Promise<GenerateRhymesOutput> {
  return generateRhymesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRhymesPrompt',
  input: {schema: GenerateRhymesInputSchema},
  output: {schema: GenerateRhymesOutputSchema},
  prompt: `You are a rhyming dictionary. Generate a list of rhymes for the following word or phrase:

{{wordOrPhrase}}

Return only the list of rhymes, do not include any other text.`,
});

const generateRhymesFlow = ai.defineFlow(
  {
    name: 'generateRhymesFlow',
    inputSchema: GenerateRhymesInputSchema,
    outputSchema: GenerateRhymesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
