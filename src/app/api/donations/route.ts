import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import DonationOption from '@/models/DonationOption';

export const dynamic = 'force-dynamic';

// GET all donation options
export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const activeOnly = searchParams.get('active') !== 'false';

        const query: Record<string, unknown> = {};
        if (activeOnly) query.isActive = true;

        const options = await DonationOption.find(query).sort({ order: 1 });

        return NextResponse.json(options);
    } catch (error) {
        console.error('Error fetching donation options:', error);
        return NextResponse.json({ error: 'Failed to fetch donation options' }, { status: 500 });
    }
}

// POST create donation option
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const data = await request.json();
        const option = await DonationOption.create(data);

        return NextResponse.json(option, { status: 201 });
    } catch (error) {
        console.error('Error creating donation option:', error);
        return NextResponse.json({ error: 'Failed to create donation option' }, { status: 500 });
    }
}
