import { handlers } from '../../../../lib/auth-config';

export const runtime = 'nodejs';

// Re-use the central NextAuth configuration from `lib/auth-config`
// so that all routes (including /api/auth/session) behave consistently.
export const { GET, POST } = handlers;