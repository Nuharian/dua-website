'use client';

import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSave } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface TeamMember {
    _id: string;
    name: string;
    role: string;
    type: 'founder' | 'co_founder' | 'member';
    organization?: string;
    email?: string;
    phone?: string;
    photo?: string;
    bio?: string;
    isActive: boolean;
    order: number;
}

const typeLabels = {
    founder: 'Founder',
    co_founder: 'Co-Founder',
    member: 'General Member',
};

export default function TeamPage() {
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
    const [formData, setFormData] = useState<{
        name: string;
        role: string;
        type: 'founder' | 'co_founder' | 'member';
        organization: string;
        email: string;
        phone: string;
        bio: string;
        isActive: boolean;
        order: number;
    }>({
        name: '',
        role: '',
        type: 'member',
        organization: '',
        email: '',
        phone: '',
        bio: '',
        isActive: true,
        order: 0,
    });

    const fetchMembers = async () => {
        try {
            const res = await fetch('/api/team?active=false');
            const data = await res.json();
            setMembers(data);
        } catch {
            toast.error('Failed to load team members');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    const openModal = (member?: TeamMember) => {
        if (member) {
            setEditingMember(member);
            setFormData({
                name: member.name,
                role: member.role,
                type: member.type,
                organization: member.organization || '',
                email: member.email || '',
                phone: member.phone || '',
                bio: member.bio || '',
                isActive: member.isActive,
                order: member.order,
            });
        } else {
            setEditingMember(null);
            setFormData({
                name: '',
                role: '',
                type: 'member',
                organization: '',
                email: '',
                phone: '',
                bio: '',
                isActive: true,
                order: members.length,
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingMember(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const url = editingMember ? `/api/team/${editingMember._id}` : '/api/team';
            const method = editingMember ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                toast.success(editingMember ? 'Member updated!' : 'Member added!');
                closeModal();
                fetchMembers();
            } else {
                toast.error('Operation failed');
            }
        } catch {
            toast.error('An error occurred');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this member?')) return;

        try {
            const res = await fetch(`/api/team/${id}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success('Member deleted');
                fetchMembers();
            } else {
                toast.error('Failed to delete');
            }
        } catch {
            toast.error('An error occurred');
        }
    };

    const groupedMembers = {
        founders: members.filter(m => m.type === 'founder' || m.type === 'co_founder'),
        members: members.filter(m => m.type === 'member'),
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Team Members</h1>
                    <p className="text-gray-400 mt-1">Manage founders and team members</p>
                </div>
                <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
                    <FiPlus />
                    Add Member
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="spinner" />
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Founders */}
                    {groupedMembers.founders.length > 0 && (
                        <div>
                            <h2 className="text-lg font-semibold text-white mb-4">Founders & Co-Founders</h2>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {groupedMembers.founders.map((member) => (
                                    <div key={member._id} className={`card ${!member.isActive ? 'opacity-50' : ''}`}>
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                                                    <span className="text-black font-bold">{member.name.charAt(0)}</span>
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-white">{member.name}</h3>
                                                    <p className="text-sm text-gold-400">{member.role}</p>
                                                    <p className="text-xs text-gray-500">{typeLabels[member.type]}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => openModal(member)}
                                                    className="p-2 rounded-lg hover:bg-zinc-700 text-gray-400 hover:text-white transition-colors"
                                                >
                                                    <FiEdit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(member._id)}
                                                    className="p-2 rounded-lg hover:bg-red-900/30 text-gray-400 hover:text-red-400 transition-colors"
                                                >
                                                    <FiTrash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                        {member.organization && (
                                            <p className="text-xs text-gray-500 mt-2">{member.organization}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* General Members */}
                    {groupedMembers.members.length > 0 && (
                        <div>
                            <h2 className="text-lg font-semibold text-white mb-4">General Members</h2>
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {groupedMembers.members.map((member) => (
                                    <div key={member._id} className={`card p-4 ${!member.isActive ? 'opacity-50' : ''}`}>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-medium text-white text-sm">{member.name}</h3>
                                                {member.organization && (
                                                    <p className="text-xs text-gray-500">{member.organization}</p>
                                                )}
                                            </div>
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={() => openModal(member)}
                                                    className="p-1.5 rounded hover:bg-zinc-700 text-gray-400 hover:text-white"
                                                >
                                                    <FiEdit2 size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(member._id)}
                                                    className="p-1.5 rounded hover:bg-red-900/30 text-gray-400 hover:text-red-400"
                                                >
                                                    <FiTrash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {members.length === 0 && (
                        <div className="text-center py-20 card">
                            <p className="text-gray-400 mb-4">No team members yet</p>
                            <button onClick={() => openModal()} className="btn-primary">
                                Add Your First Member
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/70" onClick={closeModal} />
                    <div className="relative bg-zinc-900 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white">
                                {editingMember ? 'Edit Member' : 'Add Member'}
                            </h2>
                            <button onClick={closeModal} className="text-gray-400 hover:text-white">
                                <FiX size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="input-premium"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Role *</label>
                                    <input
                                        type="text"
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        className="input-premium"
                                        placeholder="e.g., President"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Type *</label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value as 'founder' | 'co_founder' | 'member' })}
                                        className="input-premium"
                                    >
                                        <option value="founder">Founder</option>
                                        <option value="co_founder">Co-Founder</option>
                                        <option value="member">General Member</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Organization</label>
                                <input
                                    type="text"
                                    value={formData.organization}
                                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                                    className="input-premium"
                                    placeholder="e.g., University Name"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="input-premium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Phone</label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="input-premium"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Bio</label>
                                <textarea
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    className="input-premium min-h-[80px]"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="w-4 h-4 rounded bg-zinc-700 border-zinc-600 text-gold-500 focus:ring-gold-500"
                                />
                                <label htmlFor="isActive" className="text-sm text-gray-400">Active (visible on website)</label>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={closeModal} className="btn-outline flex-1">
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2">
                                    <FiSave />
                                    {editingMember ? 'Update' : 'Add'} Member
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
