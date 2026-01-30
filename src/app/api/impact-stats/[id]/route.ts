import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import ImpactStat from '@/models/ImpactStat';

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
        const stat = await ImpactStat.findByIdAndUpdate(id, data, { new: true });

        if (!stat) {
            return NextResponse.json({ error: 'Impact stat not found' }, { status: 404 });
        }

        return NextResponse.json(stat);
    } catch (error) {
        console.error('Error updating impact stat:', error);
        return NextResponse.json({ error: 'Failed to update impact stat' }, { status: 500 });
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
        const stat = await ImpactStat.findByIdAndDelete(id);

        if (!stat) {
            return NextResponse.json({ error: 'Impact stat not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Impact stat deleted successfully' });
    } catch (error) {
        console.error('Error deleting impact stat:', error);
        return NextResponse.json({ error: 'Failed to delete impact stat' }, { status: 500 });
    }
}
