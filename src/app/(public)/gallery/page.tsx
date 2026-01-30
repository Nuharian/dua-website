'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface GalleryImage {
    _id: string;
    title: string;
    description?: string;
    imageUrl: string;
    category: string;
}

export default function GalleryPage() {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [activeCategory, setActiveCategory] = useState('all');
    const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/gallery')
            .then((res) => res.json())
            .then((data) => {
                setImages(data);
                const cats = [...new Set(data.map((img: GalleryImage) => img.category))];
                setCategories(cats as string[]);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const filteredImages = activeCategory === 'all'
        ? images
        : images.filter((img) => img.category === activeCategory);

    const navigateImage = (direction: 'prev' | 'next') => {
        if (!selectedImage) return;
        const currentIndex = filteredImages.findIndex((img) => img._id === selectedImage._id);
        const newIndex = direction === 'next'
            ? (currentIndex + 1) % filteredImages.length
            : (currentIndex - 1 + filteredImages.length) % filteredImages.length;
        setSelectedImage(filteredImages[newIndex]);
    };

    return (
        <>
            {/* Hero */}
            <section className="pt-32 pb-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-radial opacity-20" />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
                    <span className="text-gold-400 text-sm font-medium uppercase tracking-wider">Our Moments</span>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mt-4 mb-6">
                        Photo <span className="text-gold-gradient">Gallery</span>
                    </h1>
                    <p className="text-xl text-gray-300">
                        Capturing moments of impact and happiness
                    </p>
                </div>
            </section>

            {/* Gallery */}
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Category Filter */}
                    {categories.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-3 mb-12">
                            <button
                                onClick={() => setActiveCategory('all')}
                                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === 'all'
                                        ? 'bg-gold-500 text-black'
                                        : 'bg-zinc-800 text-gray-400 hover:text-white'
                                    }`}
                            >
                                All
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all capitalize ${activeCategory === cat
                                            ? 'bg-gold-500 text-black'
                                            : 'bg-zinc-800 text-gray-400 hover:text-white'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Image Grid */}
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="spinner" />
                        </div>
                    ) : filteredImages.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {filteredImages.map((image, index) => (
                                <motion.div
                                    key={image._id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    className={`relative cursor-pointer group overflow-hidden rounded-2xl ${index % 5 === 0 ? 'md:col-span-2 md:row-span-2' : ''
                                        }`}
                                    onClick={() => setSelectedImage(image)}
                                >
                                    <div className={`relative ${index % 5 === 0 ? 'aspect-square' : 'aspect-[4/3]'}`}>
                                        <Image
                                            src={image.imageUrl}
                                            alt={image.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                            <h3 className="text-white font-medium">{image.title}</h3>
                                            {image.category && (
                                                <p className="text-gold-400 text-sm">{image.category}</p>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <div className="text-6xl mb-4">📷</div>
                            <h3 className="text-xl font-bold text-white mb-2">Gallery Coming Soon</h3>
                            <p className="text-gray-400">We&apos;re curating our best moments. Check back soon!</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Lightbox */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
                        onClick={() => setSelectedImage(null)}
                    >
                        {/* Close Button */}
                        <button
                            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-white hover:bg-zinc-700 transition-colors z-10"
                            onClick={() => setSelectedImage(null)}
                        >
                            <FiX size={24} />
                        </button>

                        {/* Navigation */}
                        {filteredImages.length > 1 && (
                            <>
                                <button
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-white hover:bg-zinc-700 transition-colors z-10"
                                    onClick={(e) => { e.stopPropagation(); navigateImage('prev'); }}
                                >
                                    <FiChevronLeft size={24} />
                                </button>
                                <button
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-white hover:bg-zinc-700 transition-colors z-10"
                                    onClick={(e) => { e.stopPropagation(); navigateImage('next'); }}
                                >
                                    <FiChevronRight size={24} />
                                </button>
                            </>
                        )}

                        {/* Image */}
                        <motion.div
                            key={selectedImage._id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="relative max-w-5xl max-h-[85vh] w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Image
                                src={selectedImage.imageUrl}
                                alt={selectedImage.title}
                                width={1200}
                                height={800}
                                className="object-contain w-full h-full rounded-lg"
                            />
                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
                                <h3 className="text-xl font-bold text-white">{selectedImage.title}</h3>
                                {selectedImage.description && (
                                    <p className="text-gray-300 mt-2">{selectedImage.description}</p>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
