'use client';

import { useEffect, useState } from 'react';
import { FiCopy, FiCheck, FiHeart } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface DonationOption {
    _id: string;
    type: string;
    name: string;
    accountNumber: string;
    accountName?: string;
    bankName?: string;
    branchName?: string;
    instructions?: string;
    qrCode?: string;
    isActive: boolean;
}

const typeIcons: Record<string, string> = {
    bkash: '🟪',
    nagad: '🟧',
    rocket: '🟣',
    upay: '🟢',
    bank: '🏦',
    other: '💳',
};

export default function DonatePage() {
    const [options, setOptions] = useState<DonationOption[]>([]);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/donations')
            .then((res) => res.json())
            .then((data) => {
                setOptions(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const copyToClipboard = async (text: string, id: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedId(id);
            toast.success('Copied to clipboard!');
            setTimeout(() => setCopiedId(null), 2000);
        } catch {
            toast.error('Failed to copy');
        }
    };

    return (
        <>
            {/* Hero */}
            <section className="pt-32 pb-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-radial opacity-20" />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center mx-auto mb-6">
                        <FiHeart className="text-black" size={40} />
                    </div>
                    <span className="text-gold-400 text-sm font-medium uppercase tracking-wider">Support Our Cause</span>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mt-4 mb-6">
                        Make a <span className="text-gold-gradient">Donation</span>
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Your generous donation helps us deliver happiness to those in need. Every contribution makes a difference.
                    </p>
                </div>
            </section>

            {/* Donation Options */}
            <section className="py-20" style={{ background: 'var(--bg-secondary)' }}>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl font-bold text-white">
                            Choose Your <span className="text-gold-gradient">Payment Method</span>
                        </h2>
                        <p className="text-gray-400 mt-2">Click on any account number to copy it</p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="spinner" />
                        </div>
                    ) : options.length > 0 ? (
                        <div className="grid gap-6">
                            {options.map((option) => (
                                <div key={option._id} className="card p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="text-3xl">{typeIcons[option.type] || '💳'}</div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-white">{option.name}</h3>

                                            <div className="mt-3 space-y-2">
                                                {option.accountNumber && (
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-gray-400 text-sm">Account:</span>
                                                        <button
                                                            onClick={() => copyToClipboard(option.accountNumber, option._id)}
                                                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors"
                                                        >
                                                            <span className="text-gold-400 font-mono">{option.accountNumber}</span>
                                                            {copiedId === option._id ? (
                                                                <FiCheck className="text-green-400" size={16} />
                                                            ) : (
                                                                <FiCopy className="text-gray-500" size={16} />
                                                            )}
                                                        </button>
                                                    </div>
                                                )}

                                                {option.accountName && (
                                                    <p className="text-gray-400 text-sm">
                                                        <span className="text-gray-500">Name:</span> {option.accountName}
                                                    </p>
                                                )}

                                                {option.bankName && (
                                                    <p className="text-gray-400 text-sm">
                                                        <span className="text-gray-500">Bank:</span> {option.bankName}
                                                        {option.branchName && ` (${option.branchName})`}
                                                    </p>
                                                )}

                                                {option.instructions && (
                                                    <p className="text-gray-500 text-sm mt-2">{option.instructions}</p>
                                                )}
                                            </div>
                                        </div>

                                        {option.qrCode && (
                                            <div className="hidden md:block">
                                                <img src={option.qrCode} alt={`${option.name} QR Code`} className="w-24 h-24 rounded-lg bg-white p-2" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        // Default options when none in DB
                        <div className="grid gap-6">
                            {[
                                { type: 'bkash', name: 'bKash', account: 'Coming soon...' },
                                { type: 'nagad', name: 'Nagad', account: 'Coming soon...' },
                                { type: 'rocket', name: 'Rocket', account: 'Coming soon...' },
                                { type: 'bank', name: 'Bank Transfer', account: 'Contact us for details' },
                            ].map((option, i) => (
                                <div key={i} className="card p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="text-3xl">{typeIcons[option.type]}</div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white">{option.name}</h3>
                                            <p className="text-gray-400 text-sm">{option.account}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Why Donate */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-white">
                            Why Your Donation <span className="text-gold-gradient">Matters</span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: '🏥',
                                title: 'Healthcare Access',
                                desc: 'Fund free health camps and medical treatments for underserved communities.',
                            },
                            {
                                icon: '📚',
                                title: 'Education Support',
                                desc: 'Help children access quality education and break the cycle of poverty.',
                            },
                            {
                                icon: '🍲',
                                title: 'Emergency Relief',
                                desc: 'Provide meals, shelter, and essential supplies during emergencies.',
                            },
                        ].map((item) => (
                            <div key={item.title} className="card p-8 text-center">
                                <div className="text-5xl mb-6">{item.icon}</div>
                                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                                <p className="text-gray-400">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Transparency Note */}
            <section className="py-16" style={{ background: 'var(--bg-secondary)' }}>
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-gold-500/20 flex items-center justify-center mx-auto mb-6">
                        <span className="text-2xl">✨</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-4">100% Transparency</h3>
                    <p className="text-gray-400">
                        We are committed to complete transparency in how your donations are used.
                        Every contribution goes directly to helping those in need. For any questions
                        about our financials or projects, please contact us.
                    </p>
                </div>
            </section>
        </>
    );
}
