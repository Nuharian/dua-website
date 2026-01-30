'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FiSave, FiArrowLeft, FiTrash2 } from 'react-icons/fi';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface InitiativeForm {
    title: string;
    slug: string;
    excerpt: string;
    description: string;
    status: 'ongoing' | 'passed' | 'upcoming';
    category: string;
    location: string;
    beneficiaries: number | '';
    startDate: string;
    endDate: string;
    objectives: string[];
    isActive: boolean;
    isHighlighted: boolean;
    order: number;
}

export default function InitiativeEditorPage() {
    const router = useRouter();
    const params = useParams();
    const isNew = params.id === 'new';

    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState<InitiativeForm>({
        title: '',
        slug: '',
        excerpt: '',
        description: '',
        status: 'ongoing',
        category: 'healthcare',
        location: '',
        beneficiaries: '',
        startDate: '',
        endDate: '',
        objectives: [''],
        isActive: true,
        isHighlighted: false,
        order: 0,
    });

    useEffect(() => {
        if (!isNew) {
            fetch(`/api/initiatives/${params.id}`)
                .then((res) => res.json())
                .then((data) => {
                    setFormData({
                        ...data,
                        beneficiaries: data.beneficiaries || '',
                        startDate: data.startDate ? data.startDate.split('T')[0] : '',
                        endDate: data.endDate ? data.endDate.split('T')[0] : '',
                        objectives: data.objectives?.length ? data.objectives : [''],
                    });
                    setLoading(false);
                })
                .catch(() => {
                    toast.error('Failed to load initiative');
                    setLoading(false);
                });
        }
    }, [isNew, params.id]);

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    };

    const handleTitleChange = (title: string) => {
        setFormData({
            ...formData,
            title,
            slug: isNew ? generateSlug(title) : formData.slug,
        });
    };

    const handleObjectiveChange = (index: number, value: string) => {
        const newObjectives = [...formData.objectives];
        newObjectives[index] = value;
        setFormData({ ...formData, objectives: newObjectives });
    };

    const addObjective = () => {
        setFormData({ ...formData, objectives: [...formData.objectives, ''] });
    };

    const removeObjective = (index: number) => {
        const newObjectives = formData.objectives.filter((_, i) => i !== index);
        setFormData({ ...formData, objectives: newObjectives.length ? newObjectives : [''] });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const url = isNew ? '/api/initiatives' : `/api/initiatives/${params.id}`;
            const method = isNew ? 'POST' : 'PUT';

            const payload = {
                ...formData,
                beneficiaries: formData.beneficiaries || undefined,
                startDate: formData.startDate || undefined,
                endDate: formData.endDate || undefined,
                objectives: formData.objectives.filter(o => o.trim()),
            };

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                toast.success(isNew ? 'Initiative created!' : 'Initiative updated!');
                router.push('/admin/initiatives');
            } else {
                const data = await res.json();
                toast.error(data.error || 'Operation failed');
            }
        } catch {
            toast.error('An error occurred');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="spinner" />
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href="/admin/initiatives"
                    className="p-2 rounded-lg hover:bg-zinc-800 text-gray-400 hover:text-white transition-colors"
                >
                    <FiArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-white">
                        {isNew ? 'New Initiative' : 'Edit Initiative'}
                    </h1>
                    <p className="text-gray-400 mt-1">
                        {isNew ? 'Create a new program or initiative' : 'Update initiative details'}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
                {/* Basic Info */}
                <div className="card">
                    <h2 className="text-lg font-semibold text-white mb-6">Basic Information</h2>
                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Title *</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => handleTitleChange(e.target.value)}
                                className="input-premium"
                                placeholder="e.g., DUA Healthcamp"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">URL Slug *</label>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-500">/initiatives/</span>
                                <input
                                    type="text"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    className="input-premium flex-1"
                                    placeholder="dua-healthcamp"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Status *</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value as InitiativeForm['status'] })}
                                    className="input-premium"
                                >
                                    <option value="ongoing">Ongoing</option>
                                    <option value="passed">Completed</option>
                                    <option value="upcoming">Upcoming</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Category *</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="input-premium"
                                >
                                    <option value="healthcare">Healthcare</option>
                                    <option value="education">Education</option>
                                    <option value="welfare">Welfare</option>
                                    <option value="environment">Environment</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Short Excerpt</label>
                            <textarea
                                value={formData.excerpt}
                                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                className="input-premium min-h-[80px]"
                                placeholder="Brief description for cards and previews"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Full Description *</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="input-premium min-h-[200px]"
                                placeholder="Detailed description of the initiative"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Details */}
                <div className="card">
                    <h2 className="text-lg font-semibold text-white mb-6">Details</h2>
                    <div className="grid md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Location</label>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                className="input-premium"
                                placeholder="e.g., Dhaka, Bangladesh"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Beneficiaries</label>
                            <input
                                type="number"
                                value={formData.beneficiaries}
                                onChange={(e) => setFormData({ ...formData, beneficiaries: e.target.value ? parseInt(e.target.value) : '' })}
                                className="input-premium"
                                placeholder="Number of people helped"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Start Date</label>
                            <input
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                className="input-premium"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">End Date</label>
                            <input
                                type="date"
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                className="input-premium"
                            />
                        </div>
                    </div>
                </div>

                {/* Objectives */}
                <div className="card">
                    <h2 className="text-lg font-semibold text-white mb-6">Objectives</h2>
                    <div className="space-y-3">
                        {formData.objectives.map((objective, index) => (
                            <div key={index} className="flex gap-3">
                                <input
                                    type="text"
                                    value={objective}
                                    onChange={(e) => handleObjectiveChange(index, e.target.value)}
                                    className="input-premium flex-1"
                                    placeholder={`Objective ${index + 1}`}
                                />
                                {formData.objectives.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeObjective(index)}
                                        className="p-3 rounded-lg hover:bg-red-900/30 text-gray-400 hover:text-red-400 transition-colors"
                                    >
                                        <FiTrash2 size={18} />
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addObjective}
                            className="btn-outline text-sm"
                        >
                            + Add Objective
                        </button>
                    </div>
                </div>

                {/* Settings */}
                <div className="card">
                    <h2 className="text-lg font-semibold text-white mb-6">Settings</h2>
                    <div className="space-y-4">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.isActive}
                                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                className="w-5 h-5 rounded bg-zinc-700 border-zinc-600 text-gold-500 focus:ring-gold-500"
                            />
                            <span className="text-gray-300">Active (visible on website)</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.isHighlighted}
                                onChange={(e) => setFormData({ ...formData, isHighlighted: e.target.checked })}
                                className="w-5 h-5 rounded bg-zinc-700 border-zinc-600 text-gold-500 focus:ring-gold-500"
                            />
                            <span className="text-gray-300">Featured on homepage</span>
                        </label>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                    <Link href="/admin/initiatives" className="btn-outline">
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={saving}
                        className="btn-primary flex items-center gap-2"
                    >
                        {saving ? (
                            <div className="spinner w-5 h-5" />
                        ) : (
                            <>
                                <FiSave />
                                {isNew ? 'Create Initiative' : 'Save Changes'}
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
