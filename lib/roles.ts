import { getUserFromToken, type JwtUserPayload } from './auth';

export async function requireAuth(): Promise<JwtUserPayload> {
  const user = await getUserFromToken();
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
}

export async function requireHost(): Promise<JwtUserPayload> {
  const user = await requireAuth();
  if (user.role !== 'host') {
    throw new Error('Host access required');
  }
  return user;
}

export async function requireGuest(): Promise<JwtUserPayload> {
  const user = await requireAuth();
  if (user.role !== 'guest') {
    throw new Error('Guest access required');
  }
  return user;
}

export async function isHost(userId: string): Promise<boolean> {
  const user = await getUserFromToken();
  return Boolean(user && user.role === 'host' && user.id === userId);
}

export async function canEditListing(listingHostId: string): Promise<boolean> {
  const user = await getUserFromToken();
  return Boolean(user && user.role === 'host' && user.id === listingHostId);
}


