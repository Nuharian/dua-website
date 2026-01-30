import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Message from '@/models/Message';

export const dynamic = 'force-dynamic';

// GET all messages
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const { searchParams } = new URL(request.url);
        const unreadOnly = searchParams.get('unread') === 'true';

        const query: Record<string, unknown> = {};
        if (unreadOnly) query.isRead = false;

        const messages = await Message.find(query).sort({ createdAt: -1 });

        return NextResponse.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
    }
}

// POST create message (contact form submission)
export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const data = await request.json();

        // Basic validation
        if (!data.name || !data.email || !data.subject || !data.message) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
        }

        const message = await Message.create({
            name: data.name,
            email: data.email,
            phone: data.phone || '',
            subject: data.subject,
            message: data.message,
        });

        return NextResponse.json({
            message: 'Message sent successfully',
            id: message._id
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating message:', error);
        return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }
}

