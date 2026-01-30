import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import connectDB from './mongodb';
import Admin from '@/models/Admin';

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Please provide email and password');
                }

                await connectDB();

                const admin = await Admin.findOne({ email: credentials.email.toLowerCase() });

                if (!admin) {
                    throw new Error('Invalid email or password');
                }

                const isPasswordValid = await bcrypt.compare(credentials.password, admin.password);

                if (!isPasswordValid) {
                    throw new Error('Invalid email or password');
                }

                return {
                    id: admin._id.toString(),
                    email: admin.email,
                    name: admin.name,
                    role: admin.role,
                };
            },
        }),
    ],
    session: {
        strategy: 'jwt',
        maxAge: 24 * 60 * 60, // 24 hours
    },
    pages: {
        signIn: '/admin/login',
        error: '/admin/login',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
            }
            return session;
        },
    },
};

// Type augmentation for NextAuth
declare module 'next-auth' {
    interface User {
        id: string;
        role: string;
    }

    interface Session {
        user: {
            id: string;
            email: string;
            name: string;
            role: string;
        };
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string;
        role: string;
    }
}
