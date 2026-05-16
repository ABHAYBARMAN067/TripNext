import NextAuth from 'next-auth';
import { authOptions } from '../../../../lib/auth-config';

export const runtime = 'nodejs';

// Re-use the central NextAuth configuration from `lib/auth-config`
// so that all routes (including /api/auth/session) behave consistently.
const handler = NextAuth(authOptions as any);
export { handler as GET, handler as POST };