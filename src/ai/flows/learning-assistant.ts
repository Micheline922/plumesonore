'use server';
/**
 * @fileOverview An AI tutor for creative writing concepts.
 *
 * - learningAssistant - A function that can explain a concept or generate a quiz.
 * - LearningAssistantInput - The input type for the learningAssistant function.
 * - LearningAssistantOutput - The return type for the learningAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const QuizQuestionSchema = z.object({
  question: z.string().describe('The quiz question.'),
  options: z.array(z.string()).length(4).describe('An array of 4 possible answers.'),
  answer: z.string().describe('The correct answer to the question.'),
});

const LearningAssistantInputSchema = z.object({
  topic: z.string().describe('The topic or concept the user wants to understand or be quizzed on.'),
  requestType: z.enum(['explain', 'quiz']).describe("Whether the user wants an explanation or a quiz."),
});
export type LearningAssistantInput = z.infer<typeof LearningAssistantInputSchema>;

const LearningAssistantOutputSchema = z.object({
  response: z.string().describe('The text explanation for the concept. Empty if a quiz is requested.'),
  quiz: z.array(QuizQuestionSchema).optional().describe('An array of 10 quiz questions. Empty if an explanation is requested.'),
});
export type LearningAssistantOutput = z.infer<typeof LearningAssistantOutputSchema>;

export async function learningAssistant(
  input: LearningAssistantInput
): Promise<LearningAssistantOutput> {
  return learningAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'learningAssistantPrompt',
  input: {schema: LearningAssistantInputSchema},
  output: {schema: LearningAssistantOutputSchema},
  model: 'googleai/gemini-1.5-flash-latest',
  prompt: `You are "Plume Sonore", an AI tutor for poets, slammers, and rappers. The user wants to learn about a specific topic.

Topic: "{{topic}}"
Request: "{{requestType}}"

If the request is "explain":
- Provide a clear, concise, and easy-to-understand explanation of the topic in French.
- Use examples relevant to poetry, slam, or rap.
- The 'quiz' field in the output should be empty.

If the request is "quiz":
- Generate a 10-question multiple-choice quiz about the topic, in French.
- Each question must have 4 options.
- Ensure the questions cover different aspects of the topic.
- The 'response' field in the output should be empty.
`,
});

const learningAssistantFlow = ai.defineFlow(
  {
    name: 'learningAssistantFlow',
    inputSchema: LearningAssistantInputSchema,
    outputSchema: LearningAssistantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
