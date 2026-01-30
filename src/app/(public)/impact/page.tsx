import Link from 'next/link';
import connectDB from '@/lib/mongodb';
import ImpactPost from '@/models/ImpactPost';
import ImpactStat from '@/models/ImpactStat';
import { FiArrowRight, FiCalendar, FiUser } from 'react-icons/fi';

export const dynamic = 'force-dynamic';

async function getImpactData() {
    await connectDB();

    const [posts, stats] = await Promise.all([
        ImpactPost.find({ isActive: true, isPublished: true })
            .sort({ publishedAt: -1, createdAt: -1 })
            .lean(),
        ImpactStat.find({ isActive: true }).sort({ order: 1 }).lean(),
    ]);

    return {
        posts: JSON.parse(JSON.stringify(posts)),
        stats: JSON.parse(JSON.stringify(stats)),
    };
}

export default async function ImpactPage() {
    const { posts, stats } = await getImpactData();

    return (
        <>
            {/* Hero */}
            <section className="pt-32 pb-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-radial opacity-20" />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
                    <span className="text-gold-400 text-sm font-medium uppercase tracking-wider">Our Stories</span>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mt-4 mb-6">
                        Impact & <span className="text-gold-gradient">Stories</span>
                    </h1>
                    <p className="text-xl text-gray-300">
                        Real stories of change and the difference we&apos;re making together
                    </p>
                </div>
            </section>

            {/* Impact Stats */}
            {stats.length > 0 && (
                <section className="py-16" style={{ background: 'var(--bg-secondary)' }}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                            {stats.map((stat: { _id: string; value: string; label: string }) => (
                                <div key={stat._id} className="text-center">
                                    <div className="text-4xl md:text-5xl font-bold text-gold-gradient mb-2">
                                        {stat.value}
                                    </div>
                                    <div className="text-gray-300">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Blog Posts */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-white">
                            Latest <span className="text-gold-gradient">Stories</span>
                        </h2>
                    </div>

                    {posts.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {posts.map((post: {
                                _id: string;
                                title: string;
                                slug: string;
                                excerpt?: string;
                                content: string;
                                featuredImage?: string;
                                author?: string;
                                publishedAt?: string;
                                createdAt: string;
                                category?: string;
                            }) => (
                                <Link
                                    key={post._id}
                                    href={`/impact/${post.slug}`}
                                    className="card group overflow-hidden"
                                >
                                    {/* Image */}
                                    {post.featuredImage && (
                                        <div className="relative h-48 -mx-6 -mt-6 mb-6 overflow-hidden">
                                            <img
                                                src={post.featuredImage}
                                                alt={post.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />
                                        </div>
                                    )}

                                    {/* Category */}
                                    {post.category && (
                                        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-gold-500/20 text-gold-400 mb-3">
                                            {post.category}
                                        </span>
                                    )}

                                    {/* Title */}
                                    <h3 className="text-xl font-semibold text-white group-hover:text-gold-400 transition-colors mb-3">
                                        {post.title}
                                    </h3>

                                    {/* Excerpt */}
                                    <p className="text-gray-400 text-sm line-clamp-3 mb-4">
                                        {post.excerpt || post.content.substring(0, 150)}...
                                    </p>

                                    {/* Meta */}
                                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                                        {post.author && (
                                            <span className="flex items-center gap-1">
                                                <FiUser size={12} />
                                                {post.author}
                                            </span>
                                        )}
                                        <span className="flex items-center gap-1">
                                            <FiCalendar size={12} />
                                            {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>

                                    {/* CTA */}
                                    <div className="flex items-center gap-2 text-gold-400 text-sm font-medium">
                                        Read Story
                                        <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <div className="text-6xl mb-4">📖</div>
                            <h3 className="text-xl font-bold text-white mb-2">Stories Coming Soon</h3>
                            <p className="text-gray-400 mb-6">
                                We&apos;re documenting our impact stories. Check back soon!
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA */}
            <section className="py-20" style={{ background: 'var(--bg-secondary)' }}>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Be Part of Our Story
                    </h2>
                    <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                        Your support helps us create more stories of hope and transformation. Join us in making a difference.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/donate" className="btn-primary">
                            Support Our Mission
                        </Link>
                        <Link href="/contact" className="btn-outline">
                            Share Your Story
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
