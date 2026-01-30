'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
    FiHome,
    FiSettings,
    FiUsers,
    FiImage,
    FiLayout,
    FiMail,
    FiBarChart2,
    FiHeart,
    FiDollarSign,
    FiTarget,
    FiAward,
    FiLogOut,
    FiMenu,
    FiX,
    FiBookOpen
} from 'react-icons/fi';
import { useState } from 'react';

const navItems = [
    { href: '/admin', label: 'Dashboard', icon: FiHome },
    { href: '/admin/settings', label: 'Site Settings', icon: FiSettings },
    { href: '/admin/slideshow', label: 'Slideshow', icon: FiLayout },
    { href: '/admin/team', label: 'Team Members', icon: FiUsers },
    { href: '/admin/advisors', label: 'Advisors', icon: FiAward },
    { href: '/admin/initiatives', label: 'Initiatives', icon: FiTarget },
    { href: '/admin/impact', label: 'Impact & Blog', icon: FiBookOpen },
    { href: '/admin/gallery', label: 'Gallery', icon: FiImage },
    { href: '/admin/donations', label: 'Donations', icon: FiDollarSign },
    { href: '/admin/messages', label: 'Messages', icon: FiMail },
    { href: '/admin/analytics', label: 'Analytics', icon: FiBarChart2 },
    { href: '/admin/animations', label: 'Animations', icon: FiHeart },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const handleSignOut = () => {
        signOut({ callbackUrl: '/admin/login' });
    };

    return (
        <>
            {/* Mobile menu button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-zinc-800 text-white"
            >
                {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`admin-sidebar z-50 transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                {/* Logo */}
                <div className="mb-8 px-4 pt-2">
                    <Link href="/admin" className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                            <span className="text-black font-bold text-xl">D</span>
                        </div>
                        <div>
                            <h1 className="font-bold text-lg text-white">DUA</h1>
                            <p className="text-xs text-gray-500">Admin Panel</p>
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href ||
                            (item.href !== '/admin' && pathname?.startsWith(item.href));
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={`admin-nav-item ${isActive ? 'active' : ''}`}
                            >
                                <Icon size={20} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="mt-auto pt-4 border-t border-zinc-800">
                    <Link
                        href="/"
                        target="_blank"
                        className="admin-nav-item text-sm"
                    >
                        <FiHome size={18} />
                        <span>View Website</span>
                    </Link>
                    <button
                        onClick={handleSignOut}
                        className="admin-nav-item w-full text-red-400 hover:text-red-300 hover:bg-red-900/20"
                    >
                        <FiLogOut size={18} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>
        </>
    );
}
