'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiChevronDown } from 'react-icons/fi';

const navItems = [
    { href: '/', label: 'Home' },
    {
        href: '/about',
        label: 'Who We Are',
        children: [
            { href: '/about', label: 'About Us' },
            { href: '/about/mission', label: 'Mission & Vision' },
            { href: '/about/team', label: 'Our Team' },
            { href: '/about/advisors', label: 'Advisors' },
        ]
    },
    {
        href: '/initiatives',
        label: 'What We Do',
        children: [
            { href: '/initiatives', label: 'All Initiatives' },
            { href: '/initiatives?status=ongoing', label: 'Ongoing' },
            { href: '/initiatives?status=passed', label: 'Completed' },
            { href: '/initiatives?status=upcoming', label: 'Upcoming' },
        ]
    },
    { href: '/impact', label: 'Impact' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/contact', label: 'Contact' },
    { href: '/donate', label: 'Donate' },
];

export default function Navbar() {
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsMobileMenuOpen(false);
        setActiveDropdown(null);
    }, [pathname]);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                    ? 'glass py-3'
                    : 'bg-transparent py-5'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center transition-transform group-hover:scale-110">
                            <span className="text-black font-bold text-xl">D</span>
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="font-bold text-lg text-white leading-tight">DUA</h1>
                            <p className="text-xs text-gold-400">Delivering Happiness</p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-1">
                        {navItems.map((item) => (
                            <div
                                key={item.href}
                                className="relative"
                                onMouseEnter={() => item.children && setActiveDropdown(item.label)}
                                onMouseLeave={() => setActiveDropdown(null)}
                            >
                                <Link
                                    href={item.href}
                                    className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${pathname === item.href || pathname?.startsWith(item.href + '/')
                                            ? 'text-gold-400'
                                            : 'text-gray-300 hover:text-white'
                                        }`}
                                >
                                    {item.label}
                                    {item.children && <FiChevronDown size={14} />}
                                </Link>

                                {/* Dropdown */}
                                <AnimatePresence>
                                    {item.children && activeDropdown === item.label && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute top-full left-0 mt-2 w-48 py-2 rounded-xl glass"
                                        >
                                            {item.children.map((child) => (
                                                <Link
                                                    key={child.href}
                                                    href={child.href}
                                                    className="block px-4 py-2 text-sm text-gray-300 hover:text-gold-400 hover:bg-white/5 transition-colors"
                                                >
                                                    {child.label}
                                                </Link>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}

                        {/* CTA Button */}
                        <Link href="/donate" className="ml-4 btn-primary text-sm py-2 px-6">
                            Donate Now
                        </Link>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="lg:hidden p-2 text-white"
                    >
                        {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden glass mt-2 mx-4 rounded-xl overflow-hidden"
                    >
                        <nav className="py-4">
                            {navItems.map((item) => (
                                <div key={item.href}>
                                    <Link
                                        href={item.href}
                                        className={`block px-6 py-3 text-sm font-medium transition-colors ${pathname === item.href
                                                ? 'text-gold-400 bg-gold-400/10'
                                                : 'text-gray-300 hover:text-white hover:bg-white/5'
                                            }`}
                                        onClick={() => !item.children && setIsMobileMenuOpen(false)}
                                    >
                                        {item.label}
                                    </Link>
                                    {item.children && (
                                        <div className="pl-6">
                                            {item.children.map((child) => (
                                                <Link
                                                    key={child.href}
                                                    href={child.href}
                                                    className="block px-6 py-2 text-sm text-gray-400 hover:text-gold-400"
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                >
                                                    {child.label}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                            <div className="px-6 pt-4">
                                <Link
                                    href="/donate"
                                    className="btn-primary block text-center text-sm py-3"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Donate Now
                                </Link>
                            </div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
