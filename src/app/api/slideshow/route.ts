import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import SlideshowImage from '@/models/SlideshowImage';

export const dynamic = 'force-dynamic';

// GET all slideshow images
export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const activeOnly = searchParams.get('active') !== 'false';

        const query: Record<string, unknown> = {};
        if (activeOnly) query.isActive = true;

        const images = await SlideshowImage.find(query).sort({ order: 1 }).limit(10);

        return NextResponse.json(images);
    } catch (error) {
        console.error('Error fetching slideshow:', error);
        return NextResponse.json({ error: 'Failed to fetch slideshow' }, { status: 500 });
    }
}

// POST create slideshow image
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        // Check if we already have 10 slides
        const count = await SlideshowImage.countDocuments({});
        if (count >= 10) {
            return NextResponse.json({ error: 'Maximum 10 slideshow images allowed' }, { status: 400 });
        }

        const data = await request.json();

        // Set order to next available
        if (data.order === undefined) {
            data.order = count;
        }

        const image = await SlideshowImage.create(data);

        return NextResponse.json(image, { status: 201 });
    } catch (error) {
        console.error('Error creating slideshow image:', error);
        return NextResponse.json({ error: 'Failed to create slideshow image' }, { status: 500 });
    }
}

// PUT reorder slideshow images
export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const { images } = await request.json();

        if (!Array.isArray(images)) {
            return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
        }

        // Update order for each image
        const updatePromises = images.map((item: { id: string; order: number }) =>
            SlideshowImage.findByIdAndUpdate(item.id, { order: item.order })
        );

        await Promise.all(updatePromises);

        const updatedImages = await SlideshowImage.find({}).sort({ order: 1 });

        return NextResponse.json(updatedImages);
    } catch (error) {
        console.error('Error reordering slideshow:', error);
        return NextResponse.json({ error: 'Failed to reorder slideshow' }, { status: 500 });
    }
}

