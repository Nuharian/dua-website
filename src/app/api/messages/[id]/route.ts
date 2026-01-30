import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Message from '@/models/Message';

// GET single message
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const { id } = await params;

        const message = await Message.findById(id);

        if (!message) {
            return NextResponse.json({ error: 'Message not found' }, { status: 404 });
        }

        // Mark as read
        if (!message.isRead) {
            message.isRead = true;
            await message.save();
        }

        return NextResponse.json(message);
    } catch (error) {
        console.error('Error fetching message:', error);
        return NextResponse.json({ error: 'Failed to fetch message' }, { status: 500 });
    }
}

// PUT update message (mark as read/replied)
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const { id } = await params;

        const data = await request.json();

        const updateData: Record<string, unknown> = {};
        if (data.isRead !== undefined) updateData.isRead = data.isRead;
        if (data.isReplied !== undefined) {
            updateData.isReplied = data.isReplied;
            if (data.isReplied) updateData.repliedAt = new Date();
        }
        if (data.notes !== undefined) updateData.notes = data.notes;

        const message = await Message.findByIdAndUpdate(id, updateData, { new: true });

        if (!message) {
            return NextResponse.json({ error: 'Message not found' }, { status: 404 });
        }

        return NextResponse.json(message);
    } catch (error) {
        console.error('Error updating message:', error);
        return NextResponse.json({ error: 'Failed to update message' }, { status: 500 });
    }
}

// DELETE message
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const { id } = await params;

        const message = await Message.findByIdAndDelete(id);

        if (!message) {
            return NextResponse.json({ error: 'Message not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Message deleted successfully' });
    } catch (error) {
        console.error('Error deleting message:', error);
        return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 });
    }
}
