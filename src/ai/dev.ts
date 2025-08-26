import { config } from 'dotenv';
config();

// Import all flows for local development.
import '@/ai/flows/generate-writing-prompts.ts';
import '@/ai/flows/get-feedback-on-text.ts';
import '@/ai/flows/generate-rhymes.ts';
import '@/ai/flows/generate-inspiration.ts';
import '@/ai/flows/learning-assistant.ts';
import '@/ai/flows/generate-chat-response.ts';
