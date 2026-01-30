import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import ImpactStat from '@/models/ImpactStat';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const activeOnly = searchParams.get('active') !== 'false';

        const query: Record<string, unknown> = {};
        if (activeOnly) query.isActive = true;

        const stats = await ImpactStat.find(query).sort({ order: 1 });

        return NextResponse.json(stats);
    } catch (error) {
        console.error('Error fetching impact stats:', error);
        return NextResponse.json({ error: 'Failed to fetch impact stats' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const data = await request.json();
        const stat = await ImpactStat.create(data);

        return NextResponse.json(stat, { status: 201 });
    } catch (error) {
        console.error('Error creating impact stat:', error);
        return NextResponse.json({ error: 'Failed to create impact stat' }, { status: 500 });
    }
}

