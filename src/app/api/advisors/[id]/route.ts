import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Advisor from '@/models/Advisor';

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
        const advisor = await Advisor.findByIdAndUpdate(id, data, { new: true });

        if (!advisor) {
            return NextResponse.json({ error: 'Advisor not found' }, { status: 404 });
        }

        return NextResponse.json(advisor);
    } catch (error) {
        console.error('Error updating advisor:', error);
        return NextResponse.json({ error: 'Failed to update advisor' }, { status: 500 });
    }
}

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
        const advisor = await Advisor.findByIdAndDelete(id);

        if (!advisor) {
            return NextResponse.json({ error: 'Advisor not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Advisor deleted successfully' });
    } catch (error) {
        console.error('Error deleting advisor:', error);
        return NextResponse.json({ error: 'Failed to delete advisor' }, { status: 500 });
    }
}
