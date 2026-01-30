import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Advisor from '@/models/Advisor';

export const dynamic = 'force-dynamic';

// GET all advisors
export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const activeOnly = searchParams.get('active') !== 'false';

        const query: Record<string, unknown> = {};
        if (activeOnly) query.isActive = true;

        const advisors = await Advisor.find(query).sort({ order: 1 });

        return NextResponse.json(advisors);
    } catch (error) {
        console.error('Error fetching advisors:', error);
        return NextResponse.json({ error: 'Failed to fetch advisors' }, { status: 500 });
    }
}

// POST create advisor
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const data = await request.json();
        const advisor = await Advisor.create(data);

        return NextResponse.json(advisor, { status: 201 });
    } catch (error) {
        console.error('Error creating advisor:', error);
        return NextResponse.json({ error: 'Failed to create advisor' }, { status: 500 });
    }
}

