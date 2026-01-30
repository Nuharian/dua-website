import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Partner from '@/models/Partner';

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
        const partner = await Partner.findByIdAndUpdate(id, data, { new: true });

        if (!partner) {
            return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
        }

        return NextResponse.json(partner);
    } catch (error) {
        console.error('Error updating partner:', error);
        return NextResponse.json({ error: 'Failed to update partner' }, { status: 500 });
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
        const partner = await Partner.findByIdAndDelete(id);

        if (!partner) {
            return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Partner deleted successfully' });
    } catch (error) {
        console.error('Error deleting partner:', error);
        return NextResponse.json({ error: 'Failed to delete partner' }, { status: 500 });
    }
}
