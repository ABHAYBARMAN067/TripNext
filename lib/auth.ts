import jwt, { type JwtPayload as BaseJwtPayload } from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET;

export interface JwtUserPayload extends BaseJwtPayload {
  id: string;
  email: string;
  role: 'guest' | 'host';
}

export function generateToken(payload: JwtUserPayload): string {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): JwtUserPayload | null {
  if (!JWT_SECRET) {
    return null;
  }
  try {
    return jwt.verify(token, JWT_SECRET) as JwtUserPayload;
  } catch {
    return null;
  }
}

export async function getUserFromToken(): Promise<JwtUserPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) return null;

  const decoded = verifyToken(token);
  return decoded;
}

export function setAuthCookie(response: Response, token: string): void {
  const cookie = `token=${token}; HttpOnly; ${process.env.NODE_ENV === 'production' ? 'Secure;' : ''} SameSite=strict; Max-Age=${60 * 60 * 24 * 7}; Path=/`;
  response.headers.set('set-cookie', cookie);
}

export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('token');
}


