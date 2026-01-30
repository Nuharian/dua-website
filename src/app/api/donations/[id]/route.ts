import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import DonationOption from '@/models/DonationOption';

// PUT update donation option
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
        const option = await DonationOption.findByIdAndUpdate(id, data, { new: true });

        if (!option) {
            return NextResponse.json({ error: 'Donation option not found' }, { status: 404 });
        }

        return NextResponse.json(option);
    } catch (error) {
        console.error('Error updating donation option:', error);
        return NextResponse.json({ error: 'Failed to update donation option' }, { status: 500 });
    }
}

// DELETE donation option
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

        const option = await DonationOption.findByIdAndDelete(id);

        if (!option) {
            return NextResponse.json({ error: 'Donation option not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Donation option deleted successfully' });
    } catch (error) {
        console.error('Error deleting donation option:', error);
        return NextResponse.json({ error: 'Failed to delete donation option' }, { status: 500 });
    }
}
