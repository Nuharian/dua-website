import { notFound } from 'next/navigation';
import Link from 'next/link';
import connectDB from '@/lib/mongodb';
import Initiative from '@/models/Initiative';
import { FiArrowLeft, FiCalendar, FiMapPin, FiUsers, FiTarget } from 'react-icons/fi';

export const dynamic = 'force-dynamic';

interface Props {
    params: Promise<{ slug: string }>;
}

async function getInitiative(slug: string) {
    await connectDB();
    const initiative = await Initiative.findOne({ slug, isActive: true }).lean();
    return initiative ? JSON.parse(JSON.stringify(initiative)) : null;
}

export default async function InitiativeDetailPage({ params }: Props) {
    const { slug } = await params;
    const initiative = await getInitiative(slug);

    if (!initiative) {
        notFound();
    }

    const statusColors = {
        ongoing: 'bg-green-500/20 text-green-400 border-green-500/30',
        passed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        upcoming: 'bg-gold-500/20 text-gold-400 border-gold-500/30',
    };

    return (
        <>
            {/* Hero */}
            <section className="pt-32 pb-12 relative overflow-hidden">
                {initiative.featuredImage && (
                    <>
                        <div className="absolute inset-0">
                            <img
                                src={initiative.featuredImage}
                                alt={initiative.title}
                                className="w-full h-full object-cover opacity-20"
                            />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-zinc-950/50" />
                    </>
                )}

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <Link
                        href="/initiatives"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
                    >
                        <FiArrowLeft />
                        Back to Initiatives
                    </Link>

                    <div className="flex items-center gap-3 mb-4">
                        <span className={`px-4 py-1.5 rounded-full text-sm font-medium border ${statusColors[initiative.status as keyof typeof statusColors] || statusColors.ongoing
                            }`}>
                            {initiative.status.charAt(0).toUpperCase() + initiative.status.slice(1)}
                        </span>
                        <span className="text-gray-500 capitalize">{initiative.category}</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        {initiative.title}
                    </h1>

                    {initiative.excerpt && (
                        <p className="text-xl text-gray-300">{initiative.excerpt}</p>
                    )}
                </div>
            </section>

            {/* Meta Info */}
            <section className="py-8" style={{ background: 'var(--bg-secondary)' }}>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {initiative.location && (
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-zinc-700 flex items-center justify-center">
                                    <FiMapPin className="text-gold-400" />
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs">Location</p>
                                    <p className="text-white text-sm">{initiative.location}</p>
                                </div>
                            </div>
                        )}
                        {initiative.beneficiaries && (
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-zinc-700 flex items-center justify-center">
                                    <FiUsers className="text-gold-400" />
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs">Beneficiaries</p>
                                    <p className="text-white text-sm">{initiative.beneficiaries.toLocaleString()}</p>
                                </div>
                            </div>
                        )}
                        {initiative.startDate && (
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-zinc-700 flex items-center justify-center">
                                    <FiCalendar className="text-gold-400" />
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs">Started</p>
                                    <p className="text-white text-sm">{new Date(initiative.startDate).toLocaleDateString()}</p>
                                </div>
                            </div>
                        )}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-zinc-700 flex items-center justify-center">
                                <FiTarget className="text-gold-400" />
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs">Category</p>
                                <p className="text-white text-sm capitalize">{initiative.category}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Image */}
            {initiative.featuredImage && (
                <section className="py-12">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="rounded-2xl overflow-hidden">
                            <img
                                src={initiative.featuredImage}
                                alt={initiative.title}
                                className="w-full h-auto"
                            />
                        </div>
                    </div>
                </section>
            )}

            {/* Content */}
            <section className="py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="prose-content">
                        <div
                            className="text-gray-300 leading-relaxed space-y-4"
                            dangerouslySetInnerHTML={{ __html: initiative.description.replace(/\n/g, '<br />') }}
                        />
                    </div>

                    {/* Objectives */}
                    {initiative.objectives && initiative.objectives.length > 0 && (
                        <div className="mt-12 card p-8">
                            <h2 className="text-2xl font-bold text-white mb-6">Objectives</h2>
                            <ul className="space-y-4">
                                {initiative.objectives.map((objective: string, index: number) => (
                                    <li key={index} className="flex items-start gap-4">
                                        <div className="w-8 h-8 rounded-full bg-gold-500/20 flex items-center justify-center flex-shrink-0">
                                            <span className="text-gold-400 font-medium">{index + 1}</span>
                                        </div>
                                        <p className="text-gray-300">{objective}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Images Gallery */}
                    {initiative.images && initiative.images.length > 0 && (
                        <div className="mt-12">
                            <h2 className="text-2xl font-bold text-white mb-6">Gallery</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {initiative.images.map((image: string, index: number) => (
                                    <div key={index} className="rounded-xl overflow-hidden">
                                        <img src={image} alt={`${initiative.title} ${index + 1}`} className="w-full h-48 object-cover" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA */}
            <section className="py-20" style={{ background: 'var(--bg-secondary)' }}>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">Support This Initiative</h2>
                    <p className="text-gray-400 mb-8">
                        Your contribution can help us expand this program and reach more people in need.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/donate" className="btn-primary">
                            Donate Now
                        </Link>
                        <Link href="/contact" className="btn-outline">
                            Get Involved
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
