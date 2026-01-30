import connectDB from '@/lib/mongodb';
import Message from '@/models/Message';
import Analytics from '@/models/Analytics';
import Initiative from '@/models/Initiative';
import TeamMember from '@/models/TeamMember';
import GalleryImage from '@/models/GalleryImage';
import { FiUsers, FiImage, FiTarget, FiMail, FiEye, FiGlobe } from 'react-icons/fi';

async function getDashboardStats() {
    await connectDB();

    const now = new Date();
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
        unreadMessages,
        totalMessages,
        todayVisitors,
        weekVisitors,
        totalVisitors,
        initiatives,
        teamMembers,
        galleryImages,
        recentVisitors,
        topCountries
    ] = await Promise.all([
        Message.countDocuments({ isRead: false }),
        Message.countDocuments({}),
        Analytics.countDocuments({ createdAt: { $gte: todayStart } }),
        Analytics.countDocuments({ createdAt: { $gte: weekAgo } }),
        Analytics.countDocuments({}),
        Initiative.countDocuments({ isActive: true }),
        TeamMember.countDocuments({ isActive: true }),
        GalleryImage.countDocuments({ isActive: true }),
        Analytics.find({}).sort({ createdAt: -1 }).limit(5).select('country city device createdAt entryPage'),
        Analytics.aggregate([
            { $match: { country: { $exists: true, $ne: '' } } },
            { $group: { _id: '$country', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ])
    ]);

    return {
        unreadMessages,
        totalMessages,
        todayVisitors,
        weekVisitors,
        totalVisitors,
        initiatives,
        teamMembers,
        galleryImages,
        recentVisitors: JSON.parse(JSON.stringify(recentVisitors)),
        topCountries
    };
}

export default async function AdminDashboard() {
    const stats = await getDashboardStats();

    const statCards = [
        { label: 'Total Visitors', value: stats.totalVisitors, icon: FiEye, color: 'from-blue-500 to-blue-600' },
        { label: 'Today\'s Visitors', value: stats.todayVisitors, icon: FiGlobe, color: 'from-green-500 to-green-600' },
        { label: 'Unread Messages', value: stats.unreadMessages, icon: FiMail, color: 'from-gold-400 to-gold-600' },
        { label: 'Active Initiatives', value: stats.initiatives, icon: FiTarget, color: 'from-purple-500 to-purple-600' },
        { label: 'Team Members', value: stats.teamMembers, icon: FiUsers, color: 'from-pink-500 to-pink-600' },
        { label: 'Gallery Images', value: stats.galleryImages, icon: FiImage, color: 'from-orange-500 to-orange-600' },
    ];

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                <p className="text-gray-400 mt-1">Welcome to DUA Admin Panel</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {statCards.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.label} className="card hover:scale-[1.02]">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm">{stat.label}</p>
                                    <p className="text-3xl font-bold text-white mt-1">{stat.value.toLocaleString()}</p>
                                </div>
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                                    <Icon className="text-white" size={24} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Visitors */}
                <div className="card">
                    <h2 className="text-lg font-semibold text-white mb-4">Recent Visitors</h2>
                    <div className="space-y-3">
                        {stats.recentVisitors.length > 0 ? (
                            stats.recentVisitors.map((visitor: { _id: string; country?: string; city?: string; device: string; createdAt: string; entryPage: string }, i: number) => (
                                <div key={i} className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-0">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center">
                                            <FiGlobe size={14} className="text-gray-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-white">
                                                {visitor.country || 'Unknown'}{visitor.city ? `, ${visitor.city}` : ''}
                                            </p>
                                            <p className="text-xs text-gray-500">{visitor.entryPage}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-400 capitalize">{visitor.device}</p>
                                        <p className="text-xs text-gray-500">
                                            {new Date(visitor.createdAt).toLocaleTimeString()}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm">No visitors yet</p>
                        )}
                    </div>
                </div>

                {/* Top Countries */}
                <div className="card">
                    <h2 className="text-lg font-semibold text-white mb-4">Top Countries</h2>
                    <div className="space-y-3">
                        {stats.topCountries.length > 0 ? (
                            stats.topCountries.map((country: { _id: string; count: number }, i: number) => (
                                <div key={i} className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-0">
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg">🌍</span>
                                        <p className="text-sm text-white">{country._id}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-24 h-2 bg-zinc-700 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-gold-400 to-gold-600 rounded-full"
                                                style={{ width: `${(country.count / (stats.topCountries[0]?.count || 1)) * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-sm text-gray-400 w-12 text-right">{country.count}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm">No country data yet</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8">
                <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                        { href: '/admin/slideshow', label: 'Manage Slideshow', icon: '🖼️' },
                        { href: '/admin/initiatives', label: 'Add Initiative', icon: '🎯' },
                        { href: '/admin/gallery', label: 'Upload Images', icon: '📷' },
                        { href: '/admin/messages', label: 'View Messages', icon: '✉️' },
                    ].map((action) => (
                        <a
                            key={action.href}
                            href={action.href}
                            className="card text-center py-6 hover:border-gold-500/50"
                        >
                            <span className="text-3xl mb-2 block">{action.icon}</span>
                            <span className="text-sm text-gray-300">{action.label}</span>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
