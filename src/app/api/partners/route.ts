import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Partner from '@/models/Partner';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const activeOnly = searchParams.get('active') !== 'false';

        const query: Record<string, unknown> = {};
        if (activeOnly) query.isActive = true;

        const partners = await Partner.find(query).sort({ order: 1 });

        return NextResponse.json(partners);
    } catch (error) {
        console.error('Error fetching partners:', error);
        return NextResponse.json({ error: 'Failed to fetch partners' }, { status: 500 });
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
        const partner = await Partner.create(data);

        return NextResponse.json(partner, { status: 201 });
    } catch (error) {
        console.error('Error creating partner:', error);
        return NextResponse.json({ error: 'Failed to create partner' }, { status: 500 });
    }
}

