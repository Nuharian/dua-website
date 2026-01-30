'use client';

import { useState, useEffect } from 'react';
import { FiMail, FiInbox, FiTrash2, FiX, FiPhone, FiClock, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface Message {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
    isRead: boolean;
    isReplied: boolean;
    createdAt: string;
}

export default function MessagesPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
    const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

    const fetchMessages = async () => {
        try {
            const res = await fetch('/api/messages');
            const data = await res.json();
            setMessages(data);
        } catch {
            toast.error('Failed to load messages');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const openMessage = async (message: Message) => {
        setSelectedMessage(message);

        if (!message.isRead) {
            try {
                await fetch(`/api/messages/${message._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ isRead: true }),
                });
                setMessages(messages.map(m =>
                    m._id === message._id ? { ...m, isRead: true } : m
                ));
            } catch {
                // Silent fail for read status
            }
        }
    };

    const markAsReplied = async (id: string) => {
        try {
            const res = await fetch(`/api/messages/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isReplied: true }),
            });
            if (res.ok) {
                toast.success('Marked as replied');
                setMessages(messages.map(m =>
                    m._id === id ? { ...m, isReplied: true } : m
                ));
                if (selectedMessage?._id === id) {
                    setSelectedMessage({ ...selectedMessage, isReplied: true });
                }
            }
        } catch {
            toast.error('Failed to update');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this message?')) return;

        try {
            const res = await fetch(`/api/messages/${id}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success('Message deleted');
                setMessages(messages.filter(m => m._id !== id));
                if (selectedMessage?._id === id) {
                    setSelectedMessage(null);
                }
            }
        } catch {
            toast.error('Failed to delete');
        }
    };

    const filteredMessages = messages.filter(m => {
        if (filter === 'unread') return !m.isRead;
        if (filter === 'read') return m.isRead;
        return true;
    });

    const unreadCount = messages.filter(m => !m.isRead).length;

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Messages</h1>
                    <p className="text-gray-400 mt-1">
                        {unreadCount > 0 ? `${unreadCount} unread message${unreadCount > 1 ? 's' : ''}` : 'No unread messages'}
                    </p>
                </div>
            </div>

            {/* Filter */}
            <div className="flex gap-2 mb-6">
                {(['all', 'unread', 'read'] as const).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === f
                            ? 'bg-gold-500 text-black'
                            : 'bg-zinc-800 text-gray-400 hover:text-white'
                            }`}
                    >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                        {f === 'unread' && unreadCount > 0 && (
                            <span className="ml-2 px-2 py-0.5 rounded-full bg-red-500 text-white text-xs">
                                {unreadCount}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="spinner" />
                </div>
            ) : (
                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Message List */}
                    <div className="space-y-3">
                        {filteredMessages.length > 0 ? (
                            filteredMessages.map((message) => (
                                <div
                                    key={message._id}
                                    onClick={() => openMessage(message)}
                                    className={`card cursor-pointer hover:border-gold-500/50 transition-all ${selectedMessage?._id === message._id ? 'border-gold-500' : ''
                                        } ${!message.isRead ? 'border-l-4 border-l-gold-500' : ''}`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${message.isRead ? 'bg-zinc-700' : 'bg-gold-500/20'
                                                }`}>
                                                {message.isRead ? (
                                                    <FiInbox className="text-gray-400" size={18} />
                                                ) : (
                                                    <FiMail className="text-gold-400" size={18} />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <h3 className={`font-medium truncate ${message.isRead ? 'text-gray-300' : 'text-white'}`}>
                                                        {message.name}
                                                    </h3>
                                                    {message.isReplied && (
                                                        <span className="px-2 py-0.5 rounded text-xs bg-green-500/20 text-green-400">
                                                            Replied
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gold-400 truncate">{message.subject}</p>
                                                <p className="text-xs text-gray-500 truncate mt-1">{message.message}</p>
                                            </div>
                                        </div>
                                        <div className="text-xs text-gray-500 whitespace-nowrap ml-2">
                                            {new Date(message.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 card">
                                <FiMail className="text-gray-600 mx-auto mb-3" size={32} />
                                <p className="text-gray-400">No messages found</p>
                            </div>
                        )}
                    </div>

                    {/* Message Detail */}
                    <div className="lg:sticky lg:top-24">
                        {selectedMessage ? (
                            <div className="card">
                                <div className="flex items-start justify-between mb-6">
                                    <div>
                                        <h2 className="text-xl font-bold text-white">{selectedMessage.subject}</h2>
                                        <p className="text-gray-400 text-sm mt-1">From: {selectedMessage.name}</p>
                                    </div>
                                    <button
                                        onClick={() => setSelectedMessage(null)}
                                        className="text-gray-400 hover:text-white"
                                    >
                                        <FiX size={20} />
                                    </button>
                                </div>

                                <div className="space-y-4 mb-6">
                                    <div className="flex items-center gap-3 text-sm">
                                        <FiMail className="text-gray-500" />
                                        <a href={`mailto:${selectedMessage.email}`} className="text-gold-400 hover:underline">
                                            {selectedMessage.email}
                                        </a>
                                    </div>
                                    {selectedMessage.phone && (
                                        <div className="flex items-center gap-3 text-sm">
                                            <FiPhone className="text-gray-500" />
                                            <a href={`tel:${selectedMessage.phone}`} className="text-gray-300">
                                                {selectedMessage.phone}
                                            </a>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-3 text-sm">
                                        <FiClock className="text-gray-500" />
                                        <span className="text-gray-400">
                                            {new Date(selectedMessage.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                <div className="border-t border-zinc-700 pt-6">
                                    <p className="text-gray-300 whitespace-pre-wrap">{selectedMessage.message}</p>
                                </div>

                                <div className="flex gap-3 mt-6 pt-6 border-t border-zinc-700">
                                    <a
                                        href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                                        className="btn-primary flex-1 text-center"
                                    >
                                        Reply via Email
                                    </a>
                                    {!selectedMessage.isReplied && (
                                        <button
                                            onClick={() => markAsReplied(selectedMessage._id)}
                                            className="btn-outline flex items-center gap-2"
                                        >
                                            <FiCheck />
                                            Mark Replied
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(selectedMessage._id)}
                                        className="p-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                                    >
                                        <FiTrash2 />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="card text-center py-12">
                                <FiMail className="text-gray-600 mx-auto mb-3" size={48} />
                                <p className="text-gray-400">Select a message to view details</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
