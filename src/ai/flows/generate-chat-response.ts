'use server';
/**
 * @fileOverview A flow for generating a chat response from a virtual user.
 *
 * - generateChatResponse - A function that generates a chat response.
 * - GenerateChatResponseInput - The input type for the generateChatResponse function.
 * - GenerateChatResponseOutput - The return type for the generateChatResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateChatResponseInputSchema = z.object({
  senderName: z.string().describe('The name of the user sending the message.'),
  recipientName: z.string().describe('The name of the virtual user receiving the message.'),
  message: z.string().describe('The message content from the sender.'),
});
export type GenerateChatResponseInput = z.infer<typeof GenerateChatResponseInputSchema>;

const GenerateChatResponseOutputSchema = z.object({
  response: z.string().describe("The generated response from the virtual user."),
});
export type GenerateChatResponseOutput = z.infer<typeof GenerateChatResponseOutputSchema>;

export async function generateChatResponse(
  input: GenerateChatResponseInput
): Promise<GenerateChatResponseOutput> {
  return generateChatResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateChatResponsePrompt',
  input: {schema: GenerateChatResponseInputSchema},
  output: {schema: GenerateChatResponseOutputSchema},
  model: 'googleai/gemini-1.5-flash-latest',
  prompt: `You are simulating a chat conversation for a creative writing app.
You need to act as {{recipientName}}, a virtual artist in the community.
Another user, {{senderName}}, has sent you a message.
Your personality should be supportive and creative, in the style of a poet, slammer, or rapper.
Keep your response brief, friendly, and in French.

Message from {{senderName}}:
"{{message}}"

Generate a response from {{recipientName}} to {{senderName}}.`,
});

const generateChatResponseFlow = ai.defineFlow(
  {
    name: 'generateChatResponseFlow',
    inputSchema: GenerateChatResponseInputSchema,
    outputSchema: GenerateChatResponseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
