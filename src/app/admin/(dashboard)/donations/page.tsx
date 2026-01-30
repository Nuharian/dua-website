'use client';

import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSave, FiDollarSign } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface DonationOption {
    _id: string;
    type: 'bkash' | 'nagad' | 'rocket' | 'upay' | 'bank' | 'other';
    name: string;
    accountNumber: string;
    accountName?: string;
    bankName?: string;
    branchName?: string;
    instructions?: string;
    isActive: boolean;
    order: number;
}

const typeOptions = [
    { value: 'bkash', label: 'bKash', icon: '🟪' },
    { value: 'nagad', label: 'Nagad', icon: '🟧' },
    { value: 'rocket', label: 'Rocket', icon: '🟣' },
    { value: 'upay', label: 'Upay', icon: '🟢' },
    { value: 'bank', label: 'Bank Transfer', icon: '🏦' },
    { value: 'other', label: 'Other', icon: '💳' },
];

export default function DonationsPage() {
    const [options, setOptions] = useState<DonationOption[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingOption, setEditingOption] = useState<DonationOption | null>(null);
    const [formData, setFormData] = useState({
        type: 'bkash' as DonationOption['type'],
        name: '',
        accountNumber: '',
        accountName: '',
        bankName: '',
        branchName: '',
        instructions: '',
        isActive: true,
        order: 0,
    });

    const fetchOptions = async () => {
        try {
            const res = await fetch('/api/donations?active=false');
            const data = await res.json();
            setOptions(data);
        } catch {
            toast.error('Failed to load donation options');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOptions();
    }, []);

    const openModal = (option?: DonationOption) => {
        if (option) {
            setEditingOption(option);
            setFormData({
                type: option.type,
                name: option.name,
                accountNumber: option.accountNumber,
                accountName: option.accountName || '',
                bankName: option.bankName || '',
                branchName: option.branchName || '',
                instructions: option.instructions || '',
                isActive: option.isActive,
                order: option.order,
            });
        } else {
            setEditingOption(null);
            setFormData({
                type: 'bkash',
                name: '',
                accountNumber: '',
                accountName: '',
                bankName: '',
                branchName: '',
                instructions: '',
                isActive: true,
                order: options.length,
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingOption(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const url = editingOption ? `/api/donations/${editingOption._id}` : '/api/donations';
            const method = editingOption ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                toast.success(editingOption ? 'Option updated!' : 'Option added!');
                closeModal();
                fetchOptions();
            } else {
                toast.error('Operation failed');
            }
        } catch {
            toast.error('An error occurred');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this donation option?')) return;

        try {
            const res = await fetch(`/api/donations/${id}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success('Option deleted');
                fetchOptions();
            } else {
                toast.error('Failed to delete');
            }
        } catch {
            toast.error('An error occurred');
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Donation Options</h1>
                    <p className="text-gray-400 mt-1">Manage payment methods for donations</p>
                </div>
                <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
                    <FiPlus />
                    Add Option
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="spinner" />
                </div>
            ) : (
                <div className="space-y-4">
                    {options.length > 0 ? (
                        options.map((option) => {
                            const typeInfo = typeOptions.find(t => t.value === option.type);
                            return (
                                <div key={option._id} className={`card ${!option.isActive ? 'opacity-50' : ''}`}>
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-4">
                                            <div className="text-3xl">{typeInfo?.icon || '💳'}</div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-semibold text-white">{option.name}</h3>
                                                    {!option.isActive && (
                                                        <span className="px-2 py-0.5 rounded text-xs bg-red-500/20 text-red-400">
                                                            Inactive
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-gold-400 font-mono mt-1">{option.accountNumber}</p>
                                                {option.accountName && (
                                                    <p className="text-sm text-gray-400 mt-1">Name: {option.accountName}</p>
                                                )}
                                                {option.bankName && (
                                                    <p className="text-sm text-gray-500">
                                                        {option.bankName}{option.branchName && ` (${option.branchName})`}
                                                    </p>
                                                )}
                                                {option.instructions && (
                                                    <p className="text-sm text-gray-500 mt-2">{option.instructions}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => openModal(option)}
                                                className="p-2 rounded-lg hover:bg-zinc-700 text-gray-400 hover:text-white transition-colors"
                                            >
                                                <FiEdit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(option._id)}
                                                className="p-2 rounded-lg hover:bg-red-900/30 text-gray-400 hover:text-red-400 transition-colors"
                                            >
                                                <FiTrash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-20 card">
                            <FiDollarSign className="text-gray-600 mx-auto mb-3" size={48} />
                            <p className="text-gray-400 mb-4">No donation options yet</p>
                            <button onClick={() => openModal()} className="btn-primary">
                                Add Your First Option
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
                                {editingOption ? 'Edit' : 'Add'} Donation Option
                            </h2>
                            <button onClick={closeModal} className="text-gray-400 hover:text-white">
                                <FiX size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Type *</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value as DonationOption['type'] })}
                                    className="input-premium"
                                >
                                    {typeOptions.map((type) => (
                                        <option key={type.value} value={type.value}>
                                            {type.icon} {type.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Display Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="input-premium"
                                    placeholder="e.g., bKash Personal"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Account Number *</label>
                                <input
                                    type="text"
                                    value={formData.accountNumber}
                                    onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                                    className="input-premium"
                                    placeholder="e.g., 01712345678"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Account Name</label>
                                <input
                                    type="text"
                                    value={formData.accountName}
                                    onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                                    className="input-premium"
                                    placeholder="Account holder name"
                                />
                            </div>

                            {formData.type === 'bank' && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Bank Name</label>
                                        <input
                                            type="text"
                                            value={formData.bankName}
                                            onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                                            className="input-premium"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Branch</label>
                                        <input
                                            type="text"
                                            value={formData.branchName}
                                            onChange={(e) => setFormData({ ...formData, branchName: e.target.value })}
                                            className="input-premium"
                                        />
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Instructions</label>
                                <textarea
                                    value={formData.instructions}
                                    onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                                    className="input-premium min-h-[80px]"
                                    placeholder="Optional instructions for donors"
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
                                <label htmlFor="isActive" className="text-sm text-gray-400">Active (visible on donate page)</label>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={closeModal} className="btn-outline flex-1">
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2">
                                    <FiSave />
                                    {editingOption ? 'Update' : 'Add'} Option
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
