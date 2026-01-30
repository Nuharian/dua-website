import Link from 'next/link';
import connectDB from '@/lib/mongodb';
import SlideshowImage from '@/models/SlideshowImage';
import Initiative from '@/models/Initiative';
import ImpactStat from '@/models/ImpactStat';
import Partner from '@/models/Partner';
import HeroSlideshow from '@/components/public/HeroSlideshow';
import { FiArrowRight, FiHeart, FiBookOpen, FiUsers, FiTarget } from 'react-icons/fi';

export const dynamic = 'force-dynamic';

async function getHomePageData() {
    await connectDB();

    const [slides, initiatives, impactStats, partners] = await Promise.all([
        SlideshowImage.find({ isActive: true }).sort({ order: 1 }).limit(10).lean(),
        Initiative.find({ isActive: true, isHighlighted: true }).sort({ order: 1 }).limit(6).lean(),
        ImpactStat.find({ isActive: true }).sort({ order: 1 }).lean(),
        Partner.find({ isActive: true }).sort({ order: 1 }).lean(),
    ]);

    return {
        slides: JSON.parse(JSON.stringify(slides)),
        initiatives: JSON.parse(JSON.stringify(initiatives)),
        impactStats: JSON.parse(JSON.stringify(impactStats)),
        partners: JSON.parse(JSON.stringify(partners)),
    };
}

export default async function HomePage() {
    const { slides, initiatives, impactStats, partners } = await getHomePageData();

    return (
        <>
            {/* Hero Slideshow */}
            <HeroSlideshow slides={slides} animationType="kenburns" />

            {/* About Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-radial opacity-30" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="animate-fade-in-up">
                            <span className="text-gold-400 text-sm font-medium uppercase tracking-wider">Who We Are</span>
                            <h2 className="text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
                                Development and<br />
                                <span className="text-gold-gradient">Unity Alliance</span>
                            </h2>
                            <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                                We are a community-driven nonprofit initiative that envisions a brighter future for all, especially for the underserved communities of Bangladesh.
                            </p>
                            <p className="text-gray-400 mb-8">
                                We work in various fields ranging from healthcare and education to climate action and inclusivity. Our mission is simple yet profound: to deliver happiness where it&apos;s needed most.
                            </p>
                            <Link href="/about" className="btn-outline inline-flex items-center gap-2">
                                Learn More About Us
                                <FiArrowRight />
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { icon: FiHeart, title: 'Healthcare', desc: 'Caring for every life' },
                                { icon: FiBookOpen, title: 'Education', desc: 'Empowering the next generation' },
                                { icon: FiUsers, title: 'Community', desc: 'Dignity for all' },
                                { icon: FiTarget, title: 'Environment', desc: 'Climate action' },
                            ].map((item, i) => {
                                const Icon = item.icon;
                                return (
                                    <div
                                        key={item.title}
                                        className={`card p-6 stagger-${i + 1} animate-fade-in-up`}
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-400/20 to-gold-600/20 flex items-center justify-center mb-4">
                                            <Icon className="text-gold-400" size={24} />
                                        </div>
                                        <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                                        <p className="text-gray-400 text-sm">{item.desc}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* Impact Stats */}
            {impactStats.length > 0 && (
                <section className="py-20" style={{ background: 'var(--bg-secondary)' }}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <span className="text-gold-400 text-sm font-medium uppercase tracking-wider">Our Impact</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mt-4">
                                Making a <span className="text-gold-gradient">Difference</span>
                            </h2>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                            {impactStats.map((stat: { _id: string; value: string; label: string; description?: string }, i: number) => (
                                <div
                                    key={stat._id}
                                    className={`text-center p-6 rounded-2xl bg-zinc-800/50 border border-zinc-700 hover:border-gold-500/50 transition-all duration-300 stagger-${i + 1} animate-fade-in-up`}
                                >
                                    <div className="text-4xl md:text-5xl font-bold text-gold-gradient mb-2">
                                        {stat.value}
                                    </div>
                                    <div className="text-white font-medium">{stat.label}</div>
                                    {stat.description && (
                                        <div className="text-gray-400 text-sm mt-1">{stat.description}</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Initiatives Section */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
                        <div>
                            <span className="text-gold-400 text-sm font-medium uppercase tracking-wider">What We Do</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mt-4">
                                Our <span className="text-gold-gradient">Initiatives</span>
                            </h2>
                        </div>
                        <Link href="/initiatives" className="btn-outline mt-4 md:mt-0 inline-flex items-center gap-2">
                            View All Initiatives
                            <FiArrowRight />
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {initiatives.length > 0 ? (
                            initiatives.map((initiative: { _id: string; title: string; slug: string; excerpt?: string; status: string; category: string }) => (
                                <Link
                                    key={initiative._id}
                                    href={`/initiatives/${initiative.slug}`}
                                    className="card group"
                                >
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${initiative.status === 'ongoing' ? 'bg-green-500/20 text-green-400' :
                                            initiative.status === 'passed' ? 'bg-blue-500/20 text-blue-400' :
                                                'bg-gold-500/20 text-gold-400'
                                            }`}>
                                            {initiative.status.charAt(0).toUpperCase() + initiative.status.slice(1)}
                                        </span>
                                        <span className="text-gray-500 text-xs">{initiative.category}</span>
                                    </div>
                                    <h3 className="text-xl font-semibold text-white group-hover:text-gold-400 transition-colors mb-3">
                                        {initiative.title}
                                    </h3>
                                    {initiative.excerpt && (
                                        <p className="text-gray-400 text-sm line-clamp-2">{initiative.excerpt}</p>
                                    )}
                                    <div className="mt-4 flex items-center gap-2 text-gold-400 text-sm font-medium">
                                        Learn More
                                        <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </Link>
                            ))
                        ) : (
                            // Default initiatives when none in DB
                            [
                                { title: 'DUA Healthcamp', status: 'ongoing', category: 'Healthcare', desc: 'Free health camps for underserved communities' },
                                { title: 'Climate First', status: 'ongoing', category: 'Environment', desc: 'Environmental initiatives for climate action' },
                                { title: 'Seba Tori', status: 'ongoing', category: 'Healthcare', desc: 'Mobile healthcare via boat for remote areas' },
                            ].map((item, i) => (
                                <div key={i} className="card group">
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                                            {item.status}
                                        </span>
                                        <span className="text-gray-500 text-xs">{item.category}</span>
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                                    <p className="text-gray-400 text-sm">{item.desc}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* DUA Healthcare Vision */}
            <section className="py-24 relative overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
                <div className="absolute inset-0">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold-500/5 rounded-full blur-3xl" />
                </div>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
                    <span className="text-gold-400 text-sm font-medium uppercase tracking-wider">Your Attention</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mt-4 mb-6">
                        DUA Healthcare Centre
                    </h2>
                    <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                        DUA Healthcare is a humanitarian initiative founded on the belief that access to healthcare is a fundamental human right. Our vision is to establish a compassionate hospital dedicated to providing free and quality medical care.
                    </p>
                    <p className="text-gray-400 mb-8">
                        Through the DUA Card, eligible individuals receive free medical consultations, essential treatments, and prescribed medicines. We strive to create a healthcare system where no life is neglected.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/donate" className="btn-primary">
                            Support DUA Healthcare
                        </Link>
                        <Link href="/about" className="btn-outline">
                            Learn More
                        </Link>
                    </div>
                </div>
            </section>

            {/* Partners */}
            {partners.length > 0 && (
                <section className="py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <span className="text-gold-400 text-sm font-medium uppercase tracking-wider">Trusted By</span>
                            <h2 className="text-2xl font-bold text-white mt-4">Our Partners & Collaborators</h2>
                        </div>
                        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
                            {partners.map((partner: { _id: string; name: string; logo?: string }) => (
                                <div
                                    key={partner._id}
                                    className="text-gray-400 hover:text-white transition-colors text-center"
                                >
                                    {partner.logo ? (
                                        <img src={partner.logo} alt={partner.name} className="h-12 object-contain opacity-60 hover:opacity-100 transition-opacity" />
                                    ) : (
                                        <span className="text-sm font-medium">{partner.name}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gold-600/20 via-transparent to-gold-500/10" />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        Join Us in<br />
                        <span className="text-gold-gradient">Delivering Happiness</span>
                    </h2>
                    <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                        Your support helps us reach more communities, provide essential healthcare, educate children, and create sustainable change across Bangladesh.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/donate" className="btn-primary text-lg px-10 py-4">
                            Donate Now
                        </Link>
                        <Link href="/contact" className="btn-outline text-lg px-10 py-4">
                            Get Involved
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
