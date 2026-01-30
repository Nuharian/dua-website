import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Analytics from '@/models/Analytics';

export const dynamic = 'force-dynamic';

// GET analytics data
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const { searchParams } = new URL(request.url);
        const period = searchParams.get('period') || '7d'; // 1d, 7d, 30d, all

        let startDate: Date;
        const now = new Date();

        switch (period) {
            case '1d':
                startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
                break;
            case '7d':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case '30d':
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                break;
            default:
                startDate = new Date(0);
        }

        // Get total visitors in period
        const totalVisitors = await Analytics.countDocuments({
            createdAt: { $gte: startDate }
        });

        // Get unique visitors
        const uniqueVisitors = await Analytics.distinct('visitorId', {
            createdAt: { $gte: startDate }
        });

        // Get page views
        const pageViewsAgg = await Analytics.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            { $unwind: '$pageViews' },
            { $count: 'total' }
        ]);
        const totalPageViews = pageViewsAgg[0]?.total || 0;

        // Get visitors by country
        const byCountry = await Analytics.aggregate([
            { $match: { createdAt: { $gte: startDate }, country: { $exists: true, $ne: '' } } },
            { $group: { _id: '$country', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        // Get visitors by device
        const byDevice = await Analytics.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            { $group: { _id: '$device', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        // Get top pages
        const topPages = await Analytics.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            { $unwind: '$pageViews' },
            { $group: { _id: '$pageViews.path', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        // Get visitors by day
        const byDay = await Analytics.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Get recent sessions
        const recentSessions = await Analytics.find({})
            .sort({ createdAt: -1 })
            .limit(20)
            .select('country city device browser entryPage createdAt');

        return NextResponse.json({
            period,
            totalVisitors,
            uniqueVisitors: uniqueVisitors.length,
            totalPageViews,
            byCountry,
            byDevice,
            topPages,
            byDay,
            recentSessions,
        });
    } catch (error) {
        console.error('Error fetching analytics:', error);
        return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
    }
}

// POST track visit
export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const data = await request.json();
        const { sessionId, visitorId, path, title, referrer, userAgent } = data;

        if (!sessionId || !visitorId || !path) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Get IP and geo data
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
            request.headers.get('x-real-ip') ||
            'unknown';

        // Detect device from user agent
        let device: 'desktop' | 'mobile' | 'tablet' = 'desktop';
        if (userAgent) {
            if (/mobile/i.test(userAgent)) device = 'mobile';
            else if (/tablet|ipad/i.test(userAgent)) device = 'tablet';
        }

        // Detect browser
        let browser = 'Unknown';
        if (userAgent) {
            if (/chrome/i.test(userAgent)) browser = 'Chrome';
            else if (/firefox/i.test(userAgent)) browser = 'Firefox';
            else if (/safari/i.test(userAgent)) browser = 'Safari';
            else if (/edge/i.test(userAgent)) browser = 'Edge';
        }

        // Check if session exists
        let analytics = await Analytics.findOne({ sessionId });

        if (analytics) {
            // Add page view to existing session
            analytics.pageViews.push({
                path,
                title,
                timestamp: new Date(),
            });
            analytics.exitPage = path;
            analytics.lastActivity = new Date();
            await analytics.save();
        } else {
            // Create new session
            analytics = await Analytics.create({
                sessionId,
                visitorId,
                ipAddress: ip,
                device,
                browser,
                referrer,
                pageViews: [{
                    path,
                    title,
                    timestamp: new Date(),
                }],
                entryPage: path,
                exitPage: path,
            });

            // Try to get geo data (in background, don't wait)
            fetchGeoData(ip, analytics._id.toString()).catch(console.error);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error tracking visit:', error);
        return NextResponse.json({ error: 'Failed to track visit' }, { status: 500 });
    }
}

// Background function to fetch geo data
async function fetchGeoData(ip: string, analyticsId: string) {
    try {
        if (ip === 'unknown' || ip === '127.0.0.1' || ip.startsWith('192.168.')) {
            return;
        }

        const response = await fetch(`http://ip-api.com/json/${ip}?fields=country,city,regionName`);
        const geo = await response.json();

        if (geo.country) {
            await Analytics.findByIdAndUpdate(analyticsId, {
                country: geo.country,
                city: geo.city,
                region: geo.regionName,
            });
        }
    } catch (error) {
        console.error('Geo lookup failed:', error);
    }
}

