import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Initiative from '@/models/Initiative';

export const dynamic = 'force-dynamic';

// GET all initiatives
export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const category = searchParams.get('category');
        const highlighted = searchParams.get('highlighted');
        const activeOnly = searchParams.get('active') !== 'false';

        const query: Record<string, unknown> = {};
        if (status) query.status = status;
        if (category) query.category = category;
        if (highlighted === 'true') query.isHighlighted = true;
        if (activeOnly) query.isActive = true;

        const initiatives = await Initiative.find(query).sort({ order: 1, createdAt: -1 });

        return NextResponse.json(initiatives);
    } catch (error) {
        console.error('Error fetching initiatives:', error);
        return NextResponse.json({ error: 'Failed to fetch initiatives' }, { status: 500 });
    }
}

// POST create initiative
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const data = await request.json();

        // Generate slug if not provided
        if (!data.slug && data.title) {
            data.slug = data.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
        }

        const initiative = await Initiative.create(data);

        return NextResponse.json(initiative, { status: 201 });
    } catch (error) {
        console.error('Error creating initiative:', error);
        return NextResponse.json({ error: 'Failed to create initiative' }, { status: 500 });
    }
}

