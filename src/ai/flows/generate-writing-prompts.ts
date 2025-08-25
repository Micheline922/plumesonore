'use server';
/**
 * @fileOverview A flow for generating writing prompts tailored to poetry, slam, or rap.
 *
 * - generateWritingPrompts - A function that generates writing prompts.
 * - GenerateWritingPromptsInput - The input type for the generateWritingPrompts function.
 * - GenerateWritingPromptsOutput - The return type for the generateWritingPrompts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateWritingPromptsInputSchema = z.object({
  genre: z
    .enum(['poetry', 'slam', 'rap'])
    .describe('The genre of writing prompt to generate.'),
  count: z
    .number()
    .min(1)
    .max(5)
    .default(3)
    .describe('The number of writing prompts to generate.'),
  language: z.enum(['french', 'english']).default('french').describe('The language for the prompts.'),
});
export type GenerateWritingPromptsInput = z.infer<typeof GenerateWritingPromptsInputSchema>;

const GenerateWritingPromptsOutputSchema = z.object({
  prompts: z.array(z.string()).describe('The generated writing prompts.'),
});
export type GenerateWritingPromptsOutput = z.infer<typeof GenerateWritingPromptsOutputSchema>;

export async function generateWritingPrompts(
  input: GenerateWritingPromptsInput
): Promise<GenerateWritingPromptsOutput> {
  return generateWritingPromptsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateWritingPromptsPrompt',
  input: {schema: GenerateWritingPromptsInputSchema},
  output: {schema: GenerateWritingPromptsOutputSchema},
  model: 'googleai/gemini-1.5-flash-latest',
  prompt: `You are Plume Sonore, a creative and inspiring muse for poets, slammers, and rappers. Generate {{count}} writing prompts for {{genre}} in {{language}}.

Each prompt should be unique and designed to inspire creativity and overcome writer's block. Return the prompts as a JSON array.`,
});

const generateWritingPromptsFlow = ai.defineFlow(
  {
    name: 'generateWritingPromptsFlow',
    inputSchema: GenerateWritingPromptsInputSchema,
    outputSchema: GenerateWritingPromptsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
