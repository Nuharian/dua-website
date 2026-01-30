import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import GalleryImage from '@/models/GalleryImage';

export const dynamic = 'force-dynamic';

// GET all gallery images
export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const event = searchParams.get('event');
        const activeOnly = searchParams.get('active') !== 'false';

        const query: Record<string, unknown> = {};
        if (category) query.category = category;
        if (event) query.event = event;
        if (activeOnly) query.isActive = true;

        const images = await GalleryImage.find(query).sort({ order: 1, createdAt: -1 });

        return NextResponse.json(images);
    } catch (error) {
        console.error('Error fetching gallery:', error);
        return NextResponse.json({ error: 'Failed to fetch gallery' }, { status: 500 });
    }
}

// POST create gallery image
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const data = await request.json();

        // Handle bulk upload
        if (Array.isArray(data)) {
            const images = await GalleryImage.insertMany(data);
            return NextResponse.json(images, { status: 201 });
        }

        const image = await GalleryImage.create(data);

        return NextResponse.json(image, { status: 201 });
    } catch (error) {
        console.error('Error creating gallery image:', error);
        return NextResponse.json({ error: 'Failed to create gallery image' }, { status: 500 });
    }
}

