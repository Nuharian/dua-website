import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import SlideshowImage from '@/models/SlideshowImage';

// GET single slideshow image
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;

        const image = await SlideshowImage.findById(id);

        if (!image) {
            return NextResponse.json({ error: 'Slideshow image not found' }, { status: 404 });
        }

        return NextResponse.json(image);
    } catch (error) {
        console.error('Error fetching slideshow image:', error);
        return NextResponse.json({ error: 'Failed to fetch slideshow image' }, { status: 500 });
    }
}

// PUT update slideshow image
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
        const image = await SlideshowImage.findByIdAndUpdate(id, data, { new: true });

        if (!image) {
            return NextResponse.json({ error: 'Slideshow image not found' }, { status: 404 });
        }

        return NextResponse.json(image);
    } catch (error) {
        console.error('Error updating slideshow image:', error);
        return NextResponse.json({ error: 'Failed to update slideshow image' }, { status: 500 });
    }
}

// DELETE slideshow image
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

        const image = await SlideshowImage.findByIdAndDelete(id);

        if (!image) {
            return NextResponse.json({ error: 'Slideshow image not found' }, { status: 404 });
        }

        // Reorder remaining images
        const remainingImages = await SlideshowImage.find({}).sort({ order: 1 });
        await Promise.all(
            remainingImages.map((img, index) =>
                SlideshowImage.findByIdAndUpdate(img._id, { order: index })
            )
        );

        return NextResponse.json({ message: 'Slideshow image deleted successfully' });
    } catch (error) {
        console.error('Error deleting slideshow image:', error);
        return NextResponse.json({ error: 'Failed to delete slideshow image' }, { status: 500 });
    }
}
