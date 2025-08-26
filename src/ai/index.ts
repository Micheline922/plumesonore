/**
 * This file is the entrypoint for all Genkit flow definitions.
 *
 * It is used in `genkit:dev` to load all flows for local development.
 * It is also used in the `instrumentationHook` to load all flows for production.
 */

import '@/ai/flows/generate-writing-prompts.ts';
import '@/ai/flows/get-feedback-on-text.ts';
import '@/ai/flows/generate-rhymes.ts';
import '@/ai/flows/generate-inspiration.ts';
import '@/ai/flows/learning-assistant.ts';
import '@/ai/flows/generate-chat-response.ts';
