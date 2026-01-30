import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Settings from '@/models/Settings';

export const dynamic = 'force-dynamic';

// GET settings
export async function GET() {
    try {
        await connectDB();

        let settings = await Settings.findOne({});

        // Create default settings if none exist
        if (!settings) {
            settings = await Settings.create({
                siteName: 'Development and Unity Alliance',
                tagline: 'Delivering Happiness',
            });
        }

        return NextResponse.json(settings);
    } catch (error) {
        console.error('Error fetching settings:', error);
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

// PUT update settings
export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const data = await request.json();

        let settings = await Settings.findOne({});

        if (settings) {
            settings = await Settings.findByIdAndUpdate(
                settings._id,
                { $set: data },
                { new: true }
            );
        } else {
            settings = await Settings.create(data);
        }

        return NextResponse.json(settings);
    } catch (error) {
        console.error('Error updating settings:', error);
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }
}

