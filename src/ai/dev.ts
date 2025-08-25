import { config } from 'dotenv';
config();

import '@/ai/flows/generate-writing-prompts.ts';
import '@/ai/flows/get-feedback-on-text.ts';
import '@/ai/flows/generate-rhymes.ts';
import '@/ai/flows/generate-inspiration.ts';
