'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiStar, FiMapPin, FiUsers } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface Initiative {
    _id: string;
    title: string;
    slug: string;
    excerpt?: string;
    status: 'ongoing' | 'passed' | 'upcoming';
    category: string;
    featuredImage?: string;
    location?: string;
    beneficiaries?: number;
    isActive: boolean;
    isHighlighted: boolean;
    order: number;
}

const statusColors = {
    ongoing: 'bg-green-500/20 text-green-400',
    passed: 'bg-blue-500/20 text-blue-400',
    upcoming: 'bg-gold-500/20 text-gold-400',
};

export default function InitiativesPage() {
    const [initiatives, setInitiatives] = useState<Initiative[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'ongoing' | 'passed' | 'upcoming'>('all');

    const fetchInitiatives = async () => {
        try {
            const res = await fetch('/api/initiatives?active=false');
            const data = await res.json();
            setInitiatives(data);
        } catch {
            toast.error('Failed to load initiatives');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInitiatives();
    }, []);

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

        try {
            const res = await fetch(`/api/initiatives/${id}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success('Initiative deleted');
                fetchInitiatives();
            } else {
                toast.error('Failed to delete');
            }
        } catch {
            toast.error('An error occurred');
        }
    };

    const toggleHighlight = async (id: string, current: boolean) => {
        try {
            const res = await fetch(`/api/initiatives/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isHighlighted: !current }),
            });
            if (res.ok) {
                toast.success(current ? 'Removed from highlights' : 'Added to highlights');
                fetchInitiatives();
            }
        } catch {
            toast.error('Failed to update');
        }
    };

    const filteredInitiatives = filter === 'all'
        ? initiatives
        : initiatives.filter(i => i.status === filter);

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Initiatives</h1>
                    <p className="text-gray-400 mt-1">Manage your programs and initiatives</p>
                </div>
                <Link href="/admin/initiatives/new" className="btn-primary flex items-center gap-2">
                    <FiPlus />
                    Add Initiative
                </Link>
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-6">
                {(['all', 'ongoing', 'passed', 'upcoming'] as const).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${filter === f
                                ? 'bg-gold-500 text-black'
                                : 'bg-zinc-800 text-gray-400 hover:text-white'
                            }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="spinner" />
                </div>
            ) : filteredInitiatives.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                    {filteredInitiatives.map((initiative) => (
                        <div
                            key={initiative._id}
                            className={`card overflow-hidden ${!initiative.isActive ? 'opacity-50' : ''}`}
                        >
                            {/* Image */}
                            {initiative.featuredImage && (
                                <div className="relative h-40 -mx-6 -mt-6 mb-4">
                                    <img
                                        src={initiative.featuredImage}
                                        alt={initiative.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />
                                </div>
                            )}

                            {/* Status & Highlight */}
                            <div className="flex items-center gap-2 mb-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[initiative.status]}`}>
                                    {initiative.status.charAt(0).toUpperCase() + initiative.status.slice(1)}
                                </span>
                                <span className="text-gray-500 text-xs capitalize">{initiative.category}</span>
                                {initiative.isHighlighted && (
                                    <span className="px-2 py-0.5 rounded text-xs bg-gold-500/20 text-gold-400 flex items-center gap-1">
                                        <FiStar size={10} /> Featured
                                    </span>
                                )}
                                {!initiative.isActive && (
                                    <span className="px-2 py-0.5 rounded text-xs bg-red-500/20 text-red-400">
                                        Inactive
                                    </span>
                                )}
                            </div>

                            {/* Title & Excerpt */}
                            <h3 className="text-lg font-semibold text-white mb-2">{initiative.title}</h3>
                            {initiative.excerpt && (
                                <p className="text-gray-400 text-sm line-clamp-2 mb-3">{initiative.excerpt}</p>
                            )}

                            {/* Meta */}
                            <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-4">
                                {initiative.location && (
                                    <span className="flex items-center gap-1">
                                        <FiMapPin size={12} /> {initiative.location}
                                    </span>
                                )}
                                {initiative.beneficiaries && (
                                    <span className="flex items-center gap-1">
                                        <FiUsers size={12} /> {initiative.beneficiaries.toLocaleString()} beneficiaries
                                    </span>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 pt-4 border-t border-zinc-700">
                                <Link
                                    href={`/initiatives/${initiative.slug}`}
                                    target="_blank"
                                    className="p-2 rounded-lg hover:bg-zinc-700 text-gray-400 hover:text-white transition-colors"
                                    title="View on site"
                                >
                                    <FiEye size={18} />
                                </Link>
                                <button
                                    onClick={() => toggleHighlight(initiative._id, initiative.isHighlighted)}
                                    className={`p-2 rounded-lg transition-colors ${initiative.isHighlighted
                                            ? 'bg-gold-500/20 text-gold-400'
                                            : 'hover:bg-zinc-700 text-gray-400 hover:text-white'
                                        }`}
                                    title={initiative.isHighlighted ? 'Remove from homepage' : 'Feature on homepage'}
                                >
                                    <FiStar size={18} />
                                </button>
                                <Link
                                    href={`/admin/initiatives/${initiative._id}`}
                                    className="p-2 rounded-lg hover:bg-zinc-700 text-gray-400 hover:text-white transition-colors"
                                    title="Edit"
                                >
                                    <FiEdit2 size={18} />
                                </Link>
                                <button
                                    onClick={() => handleDelete(initiative._id, initiative.title)}
                                    className="p-2 rounded-lg hover:bg-red-900/30 text-gray-400 hover:text-red-400 transition-colors"
                                    title="Delete"
                                >
                                    <FiTrash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 card">
                    <p className="text-gray-400 mb-4">No initiatives found</p>
                    <Link href="/admin/initiatives/new" className="btn-primary">
                        Create Your First Initiative
                    </Link>
                </div>
            )}
        </div>
    );
}
