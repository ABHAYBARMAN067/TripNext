import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import dbConnect from './db';
import clientPromise from './mongodb';
import bcrypt from 'bcryptjs';
import User from '../models/User';

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Use the official MongoDB client for the Auth.js adapter
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          await dbConnect();

          const user = await User.findOne({ email: credentials.email });

          if (!user) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(credentials.password as string, user.password);

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error('Auth authorize error:', error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      try {
        if (user) {
          (token as any).role = (user as any).role;
          token.sub = user.id;
        }
        return token;
      } catch (error) {
        console.error('JWT callback error:', error);
        return token;
      }
    },
    async session({ session, token }) {
      try {
        if (token && session.user) {
          (session.user as any).id = token.sub as string;
          (session.user as any).role = (token as any).role || 'guest';
        }
        return session;
      } catch (error) {
        console.error('Session callback error:', error);
        return session;
      }
    },
  },
  pages: {
    signIn: '/login',
  },
  debug: process.env.NODE_ENV === 'development',
});


