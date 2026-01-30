import Link from 'next/link';
import connectDB from '@/lib/mongodb';
import Initiative from '@/models/Initiative';
import { FiArrowRight, FiCalendar, FiMapPin, FiUsers } from 'react-icons/fi';

export const dynamic = 'force-dynamic';

interface Props {
    searchParams: Promise<{ status?: string; category?: string }>;
}

async function getInitiatives(status?: string, category?: string) {
    await connectDB();

    const query: Record<string, unknown> = { isActive: true };
    if (status) query.status = status;
    if (category) query.category = category;

    const initiatives = await Initiative.find(query).sort({ order: 1, createdAt: -1 }).lean();

    return JSON.parse(JSON.stringify(initiatives));
}

export default async function InitiativesPage({ searchParams }: Props) {
    const params = await searchParams;
    const initiatives = await getInitiatives(params.status, params.category);

    const statusFilters = [
        { value: '', label: 'All' },
        { value: 'ongoing', label: 'Ongoing' },
        { value: 'passed', label: 'Completed' },
        { value: 'upcoming', label: 'Upcoming' },
    ];

    const categoryFilters = [
        { value: '', label: 'All Categories' },
        { value: 'healthcare', label: 'Healthcare' },
        { value: 'education', label: 'Education' },
        { value: 'welfare', label: 'Welfare' },
        { value: 'environment', label: 'Environment' },
    ];

    return (
        <>
            {/* Hero */}
            <section className="pt-32 pb-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-radial opacity-20" />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
                    <span className="text-gold-400 text-sm font-medium uppercase tracking-wider">What We Do</span>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mt-4 mb-6">
                        Our <span className="text-gold-gradient">Initiatives</span>
                    </h1>
                    <p className="text-xl text-gray-300">
                        Explore our healthcare, education, and welfare programs
                    </p>
                </div>
            </section>

            {/* Filters */}
            <section className="py-8 sticky top-16 z-30 glass">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        {statusFilters.map((filter) => (
                            <Link
                                key={filter.value}
                                href={`/initiatives${filter.value ? `?status=${filter.value}` : ''}`}
                                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${(params.status || '') === filter.value
                                    ? 'bg-gold-500 text-black'
                                    : 'bg-zinc-800 text-gray-400 hover:text-white'
                                    }`}
                            >
                                {filter.label}
                            </Link>
                        ))}
                        <span className="text-gray-600 mx-2">|</span>
                        <select
                            defaultValue={params.category || ''}
                            onChange={(e) => {
                                const cat = e.target.value;
                                window.location.href = `/initiatives${cat ? `?category=${cat}` : ''}`;
                            }}
                            className="px-4 py-2 rounded-full text-sm bg-zinc-800 text-gray-300 border-0 focus:ring-2 focus:ring-gold-500"
                        >
                            {categoryFilters.map((filter) => (
                                <option key={filter.value} value={filter.value}>
                                    {filter.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </section>

            {/* Initiatives Grid */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {initiatives.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {initiatives.map((initiative: {
                                _id: string;
                                title: string;
                                slug: string;
                                excerpt?: string;
                                description: string;
                                status: string;
                                category: string;
                                featuredImage?: string;
                                location?: string;
                                beneficiaries?: number;
                                startDate?: string;
                            }) => (
                                <Link
                                    key={initiative._id}
                                    href={`/initiatives/${initiative.slug}`}
                                    className="card group overflow-hidden"
                                >
                                    {/* Image */}
                                    {initiative.featuredImage && (
                                        <div className="relative h-48 -mx-6 -mt-6 mb-6 overflow-hidden">
                                            <img
                                                src={initiative.featuredImage}
                                                alt={initiative.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />
                                        </div>
                                    )}

                                    {/* Status Badge */}
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${initiative.status === 'ongoing' ? 'bg-green-500/20 text-green-400' :
                                            initiative.status === 'passed' ? 'bg-blue-500/20 text-blue-400' :
                                                'bg-gold-500/20 text-gold-400'
                                            }`}>
                                            {initiative.status.charAt(0).toUpperCase() + initiative.status.slice(1)}
                                        </span>
                                        <span className="text-gray-500 text-xs capitalize">{initiative.category}</span>
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-xl font-semibold text-white group-hover:text-gold-400 transition-colors mb-3">
                                        {initiative.title}
                                    </h3>
                                    <p className="text-gray-400 text-sm line-clamp-3 mb-4">
                                        {initiative.excerpt || initiative.description}
                                    </p>

                                    {/* Meta */}
                                    <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-4">
                                        {initiative.location && (
                                            <span className="flex items-center gap-1">
                                                <FiMapPin size={12} />
                                                {initiative.location}
                                            </span>
                                        )}
                                        {initiative.beneficiaries && (
                                            <span className="flex items-center gap-1">
                                                <FiUsers size={12} />
                                                {initiative.beneficiaries.toLocaleString()} beneficiaries
                                            </span>
                                        )}
                                        {initiative.startDate && (
                                            <span className="flex items-center gap-1">
                                                <FiCalendar size={12} />
                                                {new Date(initiative.startDate).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>

                                    {/* CTA */}
                                    <div className="flex items-center gap-2 text-gold-400 text-sm font-medium">
                                        Learn More
                                        <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <div className="text-6xl mb-4">🎯</div>
                            <h3 className="text-xl font-bold text-white mb-2">No Initiatives Found</h3>
                            <p className="text-gray-400 mb-6">
                                {params.status || params.category
                                    ? 'Try changing the filters to see more initiatives.'
                                    : 'We are working on exciting new initiatives. Check back soon!'}
                            </p>
                            {(params.status || params.category) && (
                                <Link href="/initiatives" className="btn-outline">
                                    View All Initiatives
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
