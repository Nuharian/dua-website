import Link from 'next/link';
import connectDB from '@/lib/mongodb';
import Settings from '@/models/Settings';
import TeamMember from '@/models/TeamMember';
import Advisor from '@/models/Advisor';
import Partner from '@/models/Partner';
import { FiArrowRight, FiMail } from 'react-icons/fi';

export const dynamic = 'force-dynamic';

async function getAboutData() {
    await connectDB();

    const [settings, founders, members, advisors, partners] = await Promise.all([
        Settings.findOne({}).lean(),
        TeamMember.find({ isActive: true, type: { $in: ['founder', 'co_founder'] } }).sort({ order: 1 }).lean(),
        TeamMember.find({ isActive: true, type: 'member' }).sort({ order: 1 }).lean(),
        Advisor.find({ isActive: true }).sort({ order: 1 }).lean(),
        Partner.find({ isActive: true }).sort({ order: 1 }).lean(),
    ]);

    return {
        settings: settings ? JSON.parse(JSON.stringify(settings)) : null,
        founders: JSON.parse(JSON.stringify(founders)),
        members: JSON.parse(JSON.stringify(members)),
        advisors: JSON.parse(JSON.stringify(advisors)),
        partners: JSON.parse(JSON.stringify(partners)),
    };
}

export default async function AboutPage() {
    const { settings, founders, members, advisors, partners } = await getAboutData();

    return (
        <>
            {/* Hero */}
            <section className="pt-32 pb-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-radial opacity-20" />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
                    <span className="text-gold-400 text-sm font-medium uppercase tracking-wider">Who We Are</span>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mt-4 mb-6">
                        About <span className="text-gold-gradient">DUA</span>
                    </h1>
                    <p className="text-xl text-gray-300">
                        Development and Unity Alliance
                    </p>
                </div>
            </section>

            {/* Welcome Message */}
            <section className="py-20" style={{ background: 'var(--bg-secondary)' }}>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="prose-content">
                        <p className="text-lg text-gray-300 leading-relaxed mb-6">
                            {settings?.welcomeMessage || `We welcome you to Development and Unity Alliance (DUA), an organization that has been founded on the values of compassion, dignity, and empowerment. We are a community-driven and nonprofit initiative that envisions a brighter future for all, especially for the underserved communities of Bangladesh.`}
                        </p>
                        <p className="text-gray-400">
                            {settings?.aboutIntro || `Development and Unity Alliance is a non-profit organisation dedicated to delivering happiness and improving lives through comprehensive Healthcare, quality Education, and sustainable Communal welfare programs across Bangladesh.`}
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Mission */}
                        <div className="card p-8">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-400/20 to-gold-600/20 flex items-center justify-center mb-6">
                                <span className="text-3xl">🎯</span>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Our Mission</h2>
                            <p className="text-gold-400 text-sm mb-4">&quot;Where Compassion Meets Action&quot;</p>
                            <p className="text-gray-400">
                                {settings?.mission || `To provide comprehensive healthcare, quality education, and social welfare services that uplift communities and deliver happiness to those in need.`}
                            </p>
                        </div>

                        {/* Vision */}
                        <div className="card p-8">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-400/20 to-gold-600/20 flex items-center justify-center mb-6">
                                <span className="text-3xl">🌟</span>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Our Vision</h2>
                            <p className="text-gold-400 text-sm mb-4">&quot;A Hopeful Future&quot;</p>
                            <p className="text-gray-400">
                                {settings?.vision || `To build a society where every individual has access to quality healthcare, education, and communal support, creating sustainable communities that thrive with dignity and hope.`}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* What We Do */}
            <section className="py-24" style={{ background: 'var(--bg-secondary)' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-gold-400 text-sm font-medium uppercase tracking-wider">What We Do</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mt-4">
                            Our <span className="text-gold-gradient">Focus Areas</span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: '🏥',
                                title: 'Healthcare',
                                subtitle: 'Caring for Every Life',
                                desc: 'We believe that healthcare is a right, not a privilege. DUA is committed to ensuring every individual has access to quality medical care irrespective of financial or geographic situation.',
                            },
                            {
                                icon: '📚',
                                title: 'Education',
                                subtitle: 'Empowering the Next Generation',
                                desc: 'We believe education is the first step to a better future for all. We aim to provide accessible, quality, and inspiring education to break the cycle of poverty.',
                            },
                            {
                                icon: '❤️',
                                title: 'Communal Welfare',
                                subtitle: 'Dignity for All',
                                desc: 'We strive to restore dignity through the provision of basic needs. Our communal welfare programs are designed to support those most in need through compassion and action.',
                            },
                        ].map((item) => (
                            <div key={item.title} className="card p-8 text-center">
                                <div className="text-5xl mb-6">{item.icon}</div>
                                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                                <p className="text-gold-400 text-sm mb-4">{item.subtitle}</p>
                                <p className="text-gray-400 text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Founders */}
            {founders.length > 0 && (
                <section className="py-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <span className="text-gold-400 text-sm font-medium uppercase tracking-wider">Leadership</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mt-4">
                                Meet Our <span className="text-gold-gradient">Founders</span>
                            </h2>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {founders.map((member: { _id: string; name: string; role: string; organization?: string; photo?: string; email?: string }) => (
                                <div key={member._id} className="card p-6 text-center">
                                    <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center mb-4">
                                        {member.photo ? (
                                            <img src={member.photo} alt={member.name} className="w-full h-full rounded-full object-cover" />
                                        ) : (
                                            <span className="text-3xl text-black font-bold">{member.name.charAt(0)}</span>
                                        )}
                                    </div>
                                    <h3 className="text-lg font-bold text-white">{member.name}</h3>
                                    <p className="text-gold-400 text-sm">{member.role}</p>
                                    {member.organization && (
                                        <p className="text-gray-400 text-sm mt-1">{member.organization}</p>
                                    )}
                                    {member.email && (
                                        <a href={`mailto:${member.email}`} className="inline-flex items-center gap-1 text-gray-500 hover:text-gold-400 text-xs mt-2 transition-colors">
                                            <FiMail size={12} />
                                            {member.email}
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Team Members */}
            {members.length > 0 && (
                <section className="py-20" style={{ background: 'var(--bg-secondary)' }}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-2xl font-bold text-white">
                                General <span className="text-gold-gradient">Members</span>
                            </h2>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {members.map((member: { _id: string; name: string; organization?: string }) => (
                                <div key={member._id} className="card p-4 text-center">
                                    <div className="w-16 h-16 mx-auto rounded-full bg-zinc-700 flex items-center justify-center mb-3">
                                        <span className="text-lg font-bold text-gold-400">{member.name.charAt(0)}</span>
                                    </div>
                                    <h3 className="text-sm font-medium text-white">{member.name}</h3>
                                    {member.organization && (
                                        <p className="text-gray-500 text-xs mt-1">{member.organization}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Advisors */}
            {advisors.length > 0 && (
                <section className="py-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <span className="text-gold-400 text-sm font-medium uppercase tracking-wider">Advisory Board</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mt-4">
                                Our <span className="text-gold-gradient">Advisors</span>
                            </h2>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {advisors.map((advisor: { _id: string; name: string; title?: string; credentials?: string; organization?: string }) => (
                                <div key={advisor._id} className="card p-6">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gold-400/20 to-gold-600/20 flex items-center justify-center">
                                            <span className="text-lg font-bold text-gold-400">{advisor.name.charAt(0)}</span>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white">{advisor.name}</h3>
                                            {advisor.title && (
                                                <p className="text-gold-400 text-sm">{advisor.title}</p>
                                            )}
                                        </div>
                                    </div>
                                    {advisor.credentials && (
                                        <p className="text-gray-400 text-sm">{advisor.credentials}</p>
                                    )}
                                    {advisor.organization && (
                                        <p className="text-gray-500 text-sm mt-1">{advisor.organization}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Partners */}
            {partners.length > 0 && (
                <section className="py-20" style={{ background: 'var(--bg-secondary)' }}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <span className="text-gold-400 text-sm font-medium uppercase tracking-wider">Collaborators</span>
                            <h2 className="text-2xl font-bold text-white mt-4">
                                Trusted <span className="text-gold-gradient">Partners</span>
                            </h2>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                            {partners.map((partner: { _id: string; name: string; location?: string }) => (
                                <div key={partner._id} className="card p-4 text-center">
                                    <h3 className="text-sm font-medium text-white">{partner.name}</h3>
                                    {partner.location && (
                                        <p className="text-gray-500 text-xs mt-1">{partner.location}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA */}
            <section className="py-24">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        Want to Join Us?
                    </h2>
                    <p className="text-gray-400 mb-8">
                        We&apos;re always looking for passionate individuals to join our mission.
                    </p>
                    <Link href="/contact" className="btn-primary inline-flex items-center gap-2">
                        Get in Touch
                        <FiArrowRight />
                    </Link>
                </div>
            </section>
        </>
    );
}
