import Link from 'next/link';
import { FiFacebook, FiInstagram, FiYoutube, FiLinkedin, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { FaTiktok } from 'react-icons/fa';

const socialLinks = [
    { icon: FiFacebook, href: '#', label: 'Facebook' },
    { icon: FiInstagram, href: '#', label: 'Instagram' },
    { icon: FiYoutube, href: '#', label: 'YouTube' },
    { icon: FaTiktok, href: '#', label: 'TikTok' },
    { icon: FiLinkedin, href: '#', label: 'LinkedIn' },
];

const quickLinks = [
    { href: '/about', label: 'About Us' },
    { href: '/initiatives', label: 'What We Do' },
    { href: '/impact', label: 'Our Impact' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/donate', label: 'Donate' },
    { href: '/contact', label: 'Contact' },
];

const initiatives = [
    { href: '/initiatives/dua-healthcamp', label: 'DUA Healthcamp' },
    { href: '/initiatives/climate-first', label: 'Climate First' },
    { href: '/initiatives/korail-diaries', label: 'Korail Diaries' },
    { href: '/initiatives/seba-tori', label: 'Seba Tori' },
];

export default function Footer() {
    return (
        <footer className="relative pt-20 pb-8" style={{ background: 'var(--bg-secondary)' }}>
            {/* Decorative top border */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main Footer Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand Column */}
                    <div>
                        <Link href="/" className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                                <span className="text-black font-bold text-2xl">D</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-xl text-white">DUA</h3>
                                <p className="text-xs text-gold-400">Delivering Happiness</p>
                            </div>
                        </Link>
                        <p className="text-gray-400 text-sm mb-6">
                            Development and Unity Alliance is a non-profit organisation dedicated to delivering happiness through healthcare, education, and communal welfare.
                        </p>
                        {/* Social Links */}
                        <div className="flex gap-3">
                            {socialLinks.map((social) => {
                                const Icon = social.icon;
                                return (
                                    <a
                                        key={social.label}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-gray-400 hover:bg-gold-500 hover:text-black transition-all duration-300"
                                        aria-label={social.label}
                                    >
                                        <Icon size={18} />
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-6">Quick Links</h4>
                        <ul className="space-y-3">
                            {quickLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-400 hover:text-gold-400 text-sm transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Initiatives */}
                    <div>
                        <h4 className="text-white font-semibold mb-6">Our Initiatives</h4>
                        <ul className="space-y-3">
                            {initiatives.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-400 hover:text-gold-400 text-sm transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-white font-semibold mb-6">Contact Us</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <FiMapPin className="text-gold-400 mt-1 flex-shrink-0" size={18} />
                                <span className="text-gray-400 text-sm">
                                    25/13C, Tajmahal Road,<br />
                                    Mohammapur, Dhaka-1207,<br />
                                    Bangladesh
                                </span>
                            </li>
                            <li className="flex items-center gap-3">
                                <FiPhone className="text-gold-400 flex-shrink-0" size={18} />
                                <a href="tel:+8801743121942" className="text-gray-400 hover:text-gold-400 text-sm transition-colors">
                                    +880 1743 121942
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <FiMail className="text-gold-400 flex-shrink-0" size={18} />
                                <a href="mailto:Info@duabd.org" className="text-gray-400 hover:text-gold-400 text-sm transition-colors">
                                    Info@duabd.org
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-zinc-800">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-gray-500 text-sm text-center md:text-left">
                            © {new Date().getFullYear()} Development and Unity Alliance. All rights reserved.
                        </p>
                        <div className="flex items-center gap-6">
                            <Link href="/privacy" className="text-gray-500 hover:text-gray-400 text-sm transition-colors">
                                Privacy Policy
                            </Link>
                            <Link href="/terms" className="text-gray-500 hover:text-gray-400 text-sm transition-colors">
                                Terms of Service
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
