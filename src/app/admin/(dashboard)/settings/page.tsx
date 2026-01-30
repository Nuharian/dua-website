'use client';

import { useState, useEffect } from 'react';
import { FiSave, FiGlobe, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { FaFacebook, FaInstagram, FaYoutube, FaTiktok, FaLinkedin } from 'react-icons/fa';
import toast from 'react-hot-toast';

interface Settings {
    siteName: string;
    tagline: string;
    welcomeMessage: string;
    aboutIntro: string;
    mission: string;
    vision: string;
    contact: {
        email: string;
        phone: string;
        address: string;
    };
    social: {
        facebook: string;
        instagram: string;
        youtube: string;
        tiktok: string;
        linkedin: string;
    };
}

export default function SettingsPage() {
    const [settings, setSettings] = useState<Settings | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetch('/api/settings')
            .then((res) => res.json())
            .then((data) => {
                setSettings(data);
                setLoading(false);
            })
            .catch(() => {
                toast.error('Failed to load settings');
                setLoading(false);
            });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!settings) return;

        setSaving(true);
        try {
            const response = await fetch('/api/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings),
            });

            if (response.ok) {
                toast.success('Settings saved successfully!');
            } else {
                toast.error('Failed to save settings');
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

    if (!settings) {
        return (
            <div className="text-center py-20">
                <p className="text-gray-400">Failed to load settings. Please refresh the page.</p>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Site Settings</h1>
                    <p className="text-gray-400 mt-1">Manage your website configuration</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* General Settings */}
                <div className="card">
                    <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                        <FiGlobe className="text-gold-400" />
                        General Settings
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Site Name</label>
                            <input
                                type="text"
                                value={settings.siteName}
                                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                                className="input-premium"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Tagline</label>
                            <input
                                type="text"
                                value={settings.tagline}
                                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                                className="input-premium"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-400 mb-2">Welcome Message</label>
                            <textarea
                                value={settings.welcomeMessage}
                                onChange={(e) => setSettings({ ...settings, welcomeMessage: e.target.value })}
                                className="input-premium min-h-[100px]"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-400 mb-2">About Introduction</label>
                            <textarea
                                value={settings.aboutIntro}
                                onChange={(e) => setSettings({ ...settings, aboutIntro: e.target.value })}
                                className="input-premium min-h-[100px]"
                            />
                        </div>
                    </div>
                </div>

                {/* Mission & Vision */}
                <div className="card">
                    <h2 className="text-lg font-semibold text-white mb-6">Mission & Vision</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Mission Statement</label>
                            <textarea
                                value={settings.mission}
                                onChange={(e) => setSettings({ ...settings, mission: e.target.value })}
                                className="input-premium min-h-[120px]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Vision Statement</label>
                            <textarea
                                value={settings.vision}
                                onChange={(e) => setSettings({ ...settings, vision: e.target.value })}
                                className="input-premium min-h-[120px]"
                            />
                        </div>
                    </div>
                </div>

                {/* Contact Info */}
                <div className="card">
                    <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                        <FiMail className="text-gold-400" />
                        Contact Information
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                                <FiMail size={14} /> Email Address
                            </label>
                            <input
                                type="email"
                                value={settings.contact.email}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    contact: { ...settings.contact, email: e.target.value }
                                })}
                                className="input-premium"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                                <FiPhone size={14} /> Phone Number
                            </label>
                            <input
                                type="tel"
                                value={settings.contact.phone}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    contact: { ...settings.contact, phone: e.target.value }
                                })}
                                className="input-premium"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                                <FiMapPin size={14} /> Address
                            </label>
                            <textarea
                                value={settings.contact.address}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    contact: { ...settings.contact, address: e.target.value }
                                })}
                                className="input-premium"
                            />
                        </div>
                    </div>
                </div>

                {/* Social Links */}
                <div className="card">
                    <h2 className="text-lg font-semibold text-white mb-6">Social Media Links</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                                <FaFacebook className="text-blue-500" /> Facebook
                            </label>
                            <input
                                type="url"
                                value={settings.social.facebook}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    social: { ...settings.social, facebook: e.target.value }
                                })}
                                className="input-premium"
                                placeholder="https://facebook.com/..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                                <FaInstagram className="text-pink-500" /> Instagram
                            </label>
                            <input
                                type="url"
                                value={settings.social.instagram}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    social: { ...settings.social, instagram: e.target.value }
                                })}
                                className="input-premium"
                                placeholder="https://instagram.com/..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                                <FaYoutube className="text-red-500" /> YouTube
                            </label>
                            <input
                                type="url"
                                value={settings.social.youtube}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    social: { ...settings.social, youtube: e.target.value }
                                })}
                                className="input-premium"
                                placeholder="https://youtube.com/..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                                <FaTiktok /> TikTok
                            </label>
                            <input
                                type="url"
                                value={settings.social.tiktok}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    social: { ...settings.social, tiktok: e.target.value }
                                })}
                                className="input-premium"
                                placeholder="https://tiktok.com/..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                                <FaLinkedin className="text-blue-400" /> LinkedIn
                            </label>
                            <input
                                type="url"
                                value={settings.social.linkedin}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    social: { ...settings.social, linkedin: e.target.value }
                                })}
                                className="input-premium"
                                placeholder="https://linkedin.com/..."
                            />
                        </div>
                    </div>
                </div>

                {/* Submit */}
                <div className="flex justify-end">
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
                                Save Settings
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
