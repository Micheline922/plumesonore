/**
 * This file is used to load all Genkit flows for production.
 * It is specified in `next.config.ts` as the `instrumentationHook`.
 *
 * It is not used in local development.
 */
export async function register() {
  console.log('Registering Genkit flows for production...');
  await import('@/ai');
}
