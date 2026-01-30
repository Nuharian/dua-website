import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Initiative from '@/models/Initiative';

// GET single initiative
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;

        // Try to find by ID first, then by slug
        let initiative = await Initiative.findById(id).catch(() => null);

        if (!initiative) {
            initiative = await Initiative.findOne({ slug: id });
        }

        if (!initiative) {
            return NextResponse.json({ error: 'Initiative not found' }, { status: 404 });
        }

        return NextResponse.json(initiative);
    } catch (error) {
        console.error('Error fetching initiative:', error);
        return NextResponse.json({ error: 'Failed to fetch initiative' }, { status: 500 });
    }
}

// PUT update initiative
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
        const initiative = await Initiative.findByIdAndUpdate(id, data, { new: true });

        if (!initiative) {
            return NextResponse.json({ error: 'Initiative not found' }, { status: 404 });
        }

        return NextResponse.json(initiative);
    } catch (error) {
        console.error('Error updating initiative:', error);
        return NextResponse.json({ error: 'Failed to update initiative' }, { status: 500 });
    }
}

// DELETE initiative
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

        const initiative = await Initiative.findByIdAndDelete(id);

        if (!initiative) {
            return NextResponse.json({ error: 'Initiative not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Initiative deleted successfully' });
    } catch (error) {
        console.error('Error deleting initiative:', error);
        return NextResponse.json({ error: 'Failed to delete initiative' }, { status: 500 });
    }
}
