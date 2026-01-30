'use client';

import { useState, useEffect } from 'react';
import { FiEye, FiUsers, FiGlobe, FiMonitor, FiSmartphone, FiCalendar } from 'react-icons/fi';

interface AnalyticsData {
    summary: {
        totalSessions: number;
        uniqueVisitors: number;
        totalPageViews: number;
        todaySessions: number;
        weekSessions: number;
        monthSessions: number;
    };
    topCountries: { _id: string; count: number }[];
    topPages: { _id: string; count: number }[];
    deviceBreakdown: { _id: string; count: number }[];
    browserBreakdown: { _id: string; count: number }[];
    recentVisits: {
        country?: string;
        city?: string;
        device: string;
        browser: string;
        entryPage: string;
        createdAt: string;
    }[];
}

export default function AnalyticsPage() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d');

    useEffect(() => {
        fetch(`/api/analytics?period=${period}`)
            .then((res) => res.json())
            .then((data) => {
                setData(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [period]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="spinner" />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="text-center py-20">
                <p className="text-gray-400">Failed to load analytics data</p>
            </div>
        );
    }

    const summaryCards = [
        { label: 'Total Sessions', value: data.summary.totalSessions, icon: FiEye, color: 'from-blue-500 to-blue-600' },
        { label: 'Unique Visitors', value: data.summary.uniqueVisitors, icon: FiUsers, color: 'from-green-500 to-green-600' },
        { label: 'Page Views', value: data.summary.totalPageViews, icon: FiGlobe, color: 'from-gold-400 to-gold-600' },
        { label: 'Today', value: data.summary.todaySessions, icon: FiCalendar, color: 'from-purple-500 to-purple-600' },
        { label: 'This Week', value: data.summary.weekSessions, icon: FiCalendar, color: 'from-pink-500 to-pink-600' },
        { label: 'This Month', value: data.summary.monthSessions, icon: FiCalendar, color: 'from-orange-500 to-orange-600' },
    ];

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Analytics</h1>
                    <p className="text-gray-400 mt-1">Track your website visitors and performance</p>
                </div>
                <div className="flex gap-2">
                    {(['7d', '30d', '90d'] as const).map((p) => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${period === p
                                    ? 'bg-gold-500 text-black'
                                    : 'bg-zinc-800 text-gray-400 hover:text-white'
                                }`}
                        >
                            {p === '7d' ? '7 Days' : p === '30d' ? '30 Days' : '90 Days'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                {summaryCards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <div key={card.label} className="card text-center">
                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center mx-auto mb-3`}>
                                <Icon className="text-white" size={20} />
                            </div>
                            <p className="text-2xl font-bold text-white">{card.value.toLocaleString()}</p>
                            <p className="text-xs text-gray-500 mt-1">{card.label}</p>
                        </div>
                    );
                })}
            </div>

            {/* Charts Row */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Top Countries */}
                <div className="card">
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <FiGlobe className="text-gold-400" />
                        Top Countries
                    </h2>
                    <div className="space-y-3">
                        {data.topCountries.length > 0 ? (
                            data.topCountries.map((country, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <span className="text-gray-300">{country._id || 'Unknown'}</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-24 h-2 bg-zinc-700 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-gold-400 to-gold-600 rounded-full"
                                                style={{ width: `${(country.count / (data.topCountries[0]?.count || 1)) * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-sm text-gray-500 w-10 text-right">{country.count}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm">No data yet</p>
                        )}
                    </div>
                </div>

                {/* Top Pages */}
                <div className="card">
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <FiEye className="text-gold-400" />
                        Top Pages
                    </h2>
                    <div className="space-y-3">
                        {data.topPages.length > 0 ? (
                            data.topPages.map((page, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <span className="text-gray-300 truncate flex-1">{page._id}</span>
                                    <div className="flex items-center gap-2 ml-2">
                                        <div className="w-20 h-2 bg-zinc-700 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
                                                style={{ width: `${(page.count / (data.topPages[0]?.count || 1)) * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-sm text-gray-500 w-10 text-right">{page.count}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm">No data yet</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Device & Browser */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Devices */}
                <div className="card">
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <FiMonitor className="text-gold-400" />
                        Devices
                    </h2>
                    <div className="flex flex-wrap gap-4">
                        {data.deviceBreakdown.length > 0 ? (
                            data.deviceBreakdown.map((device, i) => (
                                <div key={i} className="flex items-center gap-3 bg-zinc-800 rounded-lg px-4 py-3">
                                    {device._id === 'mobile' ? (
                                        <FiSmartphone className="text-gold-400" />
                                    ) : (
                                        <FiMonitor className="text-gold-400" />
                                    )}
                                    <div>
                                        <p className="text-white capitalize">{device._id}</p>
                                        <p className="text-xs text-gray-500">{device.count} visits</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm">No data yet</p>
                        )}
                    </div>
                </div>

                {/* Browsers */}
                <div className="card">
                    <h2 className="text-lg font-semibold text-white mb-4">Browsers</h2>
                    <div className="flex flex-wrap gap-3">
                        {data.browserBreakdown.length > 0 ? (
                            data.browserBreakdown.map((browser, i) => (
                                <div key={i} className="bg-zinc-800 rounded-lg px-4 py-2">
                                    <span className="text-white capitalize">{browser._id || 'Unknown'}</span>
                                    <span className="text-gray-500 text-sm ml-2">({browser.count})</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm">No data yet</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Recent Visits */}
            <div className="card">
                <h2 className="text-lg font-semibold text-white mb-4">Recent Visits</h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-gray-500 text-sm border-b border-zinc-700">
                                <th className="pb-3 font-medium">Location</th>
                                <th className="pb-3 font-medium">Page</th>
                                <th className="pb-3 font-medium">Device</th>
                                <th className="pb-3 font-medium">Browser</th>
                                <th className="pb-3 font-medium text-right">Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.recentVisits.length > 0 ? (
                                data.recentVisits.map((visit, i) => (
                                    <tr key={i} className="border-b border-zinc-800 last:border-0">
                                        <td className="py-3 text-gray-300">
                                            {visit.country || 'Unknown'}{visit.city ? `, ${visit.city}` : ''}
                                        </td>
                                        <td className="py-3 text-gray-400 truncate max-w-[200px]">{visit.entryPage}</td>
                                        <td className="py-3 text-gray-400 capitalize">{visit.device}</td>
                                        <td className="py-3 text-gray-400">{visit.browser}</td>
                                        <td className="py-3 text-gray-500 text-right text-sm">
                                            {new Date(visit.createdAt).toLocaleString()}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-gray-500">
                                        No visits recorded yet
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
