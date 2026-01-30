'use client';

import { useState } from 'react';
import { FiMapPin, FiPhone, FiMail, FiSend, FiCheck } from 'react-icons/fi';
import { FaFacebook, FaInstagram, FaYoutube, FaTiktok, FaLinkedin } from 'react-icons/fa';
import toast from 'react-hot-toast';

const socialLinks = [
    { icon: FaFacebook, href: '#', label: 'Facebook', color: 'hover:text-blue-500' },
    { icon: FaInstagram, href: '#', label: 'Instagram', color: 'hover:text-pink-500' },
    { icon: FaYoutube, href: '#', label: 'YouTube', color: 'hover:text-red-500' },
    { icon: FaTiktok, href: '#', label: 'TikTok', color: 'hover:text-white' },
    { icon: FaLinkedin, href: '#', label: 'LinkedIn', color: 'hover:text-blue-400' },
];

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setIsSubmitted(true);
                setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
                toast.success('Message sent successfully!');
            } else {
                const data = await response.json();
                toast.error(data.error || 'Failed to send message');
            }
        } catch {
            toast.error('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {/* Hero */}
            <section className="pt-32 pb-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-radial opacity-20" />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
                    <span className="text-gold-400 text-sm font-medium uppercase tracking-wider">Get in Touch</span>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mt-4 mb-6">
                        Contact <span className="text-gold-gradient">Us</span>
                    </h1>
                    <p className="text-xl text-gray-300">
                        We&apos;d love to hear from you
                    </p>
                </div>
            </section>

            {/* Contact Content */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16">
                        {/* Contact Form */}
                        <div className="card p-8">
                            <h2 className="text-2xl font-bold text-white mb-6">Send us a Message</h2>

                            {isSubmitted ? (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                                        <FiCheck className="text-green-400" size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">Thank You!</h3>
                                    <p className="text-gray-400 mb-6">Your message has been sent successfully. We&apos;ll get back to you soon.</p>
                                    <button
                                        onClick={() => setIsSubmitted(false)}
                                        className="btn-outline"
                                    >
                                        Send Another Message
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="grid md:grid-cols-2 gap-5">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">
                                                Your Name *
                                            </label>
                                            <input
                                                id="name"
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="input-premium"
                                                placeholder="John Doe"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
                                                Email Address *
                                            </label>
                                            <input
                                                id="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="input-premium"
                                                placeholder="john@example.com"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-5">
                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-medium text-gray-400 mb-2">
                                                Phone Number
                                            </label>
                                            <input
                                                id="phone"
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="input-premium"
                                                placeholder="+880 1XXX XXX XXX"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="subject" className="block text-sm font-medium text-gray-400 mb-2">
                                                Subject *
                                            </label>
                                            <input
                                                id="subject"
                                                type="text"
                                                value={formData.subject}
                                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                                className="input-premium"
                                                placeholder="How can we help?"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-2">
                                            Message *
                                        </label>
                                        <textarea
                                            id="message"
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            className="input-premium min-h-[150px] resize-none"
                                            placeholder="Tell us more about your inquiry..."
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="btn-primary w-full flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            <div className="spinner w-5 h-5" />
                                        ) : (
                                            <>
                                                <FiSend />
                                                Send Message
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>

                        {/* Contact Info */}
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-8">Contact Information</h2>

                            <div className="space-y-6 mb-12">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-gold-500/20 flex items-center justify-center flex-shrink-0">
                                        <FiMapPin className="text-gold-400" size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-medium mb-1">Our Address</h3>
                                        <p className="text-gray-400">
                                            25/13C, Tajmahal Road,<br />
                                            Mohammapur, Dhaka-1207,<br />
                                            Bangladesh
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-gold-500/20 flex items-center justify-center flex-shrink-0">
                                        <FiPhone className="text-gold-400" size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-medium mb-1">Phone</h3>
                                        <a href="tel:+8801743121942" className="text-gray-400 hover:text-gold-400 transition-colors">
                                            +880 1743 121942
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-gold-500/20 flex items-center justify-center flex-shrink-0">
                                        <FiMail className="text-gold-400" size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-medium mb-1">Email</h3>
                                        <a href="mailto:Info@duabd.org" className="text-gray-400 hover:text-gold-400 transition-colors">
                                            Info@duabd.org
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Social Links */}
                            <div className="mb-12">
                                <h3 className="text-white font-medium mb-4">Follow Us</h3>
                                <div className="flex gap-3">
                                    {socialLinks.map((social) => {
                                        const Icon = social.icon;
                                        return (
                                            <a
                                                key={social.label}
                                                href={social.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-gray-400 ${social.color} transition-all duration-300 hover:scale-110`}
                                                aria-label={social.label}
                                            >
                                                <Icon size={20} />
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Map Placeholder */}
                            <div className="rounded-2xl overflow-hidden h-64 bg-zinc-800 flex items-center justify-center">
                                <div className="text-center">
                                    <FiMapPin className="text-gold-400 mx-auto mb-2" size={32} />
                                    <p className="text-gray-400 text-sm">Google Maps will be here</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
