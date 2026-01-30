'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface SlideData {
    _id: string;
    imageUrl: string;
    title?: string;
    subtitle?: string;
    buttonText?: string;
    buttonLink?: string;
}

interface HeroSlideshowProps {
    slides: SlideData[];
    animationType?: 'fade' | 'slide' | 'zoom' | 'parallax' | 'kenburns';
}

export default function HeroSlideshow({ slides, animationType = 'kenburns' }: HeroSlideshowProps) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [direction, setDirection] = useState(0);

    // Auto-advance slides
    useEffect(() => {
        if (slides.length <= 1) return;

        const timer = setInterval(() => {
            setDirection(1);
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 7000);

        return () => clearInterval(timer);
    }, [slides.length]);

    const goToSlide = (index: number) => {
        setDirection(index > currentSlide ? 1 : -1);
        setCurrentSlide(index);
    };

    const nextSlide = () => {
        setDirection(1);
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setDirection(-1);
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    if (slides.length === 0) {
        // Fallback when no slides
        return (
            <section className="relative h-screen flex items-center justify-center overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
                <div className="absolute inset-0 bg-gradient-to-b from-gold-500/10 via-transparent to-transparent" />
                <div className="relative z-10 text-center px-4">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
                    >
                        Development and<br />
                        <span className="text-gold-gradient">Unity Alliance</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-xl md:text-2xl text-gray-300 mb-8"
                    >
                        Delivering Happiness
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <Link href="/about" className="btn-primary">
                            Learn More
                        </Link>
                        <Link href="/donate" className="btn-outline">
                            Support Us
                        </Link>
                    </motion.div>
                </div>
            </section>
        );
    }

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        })
    };

    const slide = slides[currentSlide];

    return (
        <section className="relative h-screen overflow-hidden">
            {/* Background Slides */}
            <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                    key={currentSlide}
                    custom={direction}
                    variants={animationType === 'slide' ? slideVariants : undefined}
                    initial={{ opacity: 0, scale: animationType === 'zoom' ? 1.1 : 1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: animationType === 'zoom' ? 0.95 : 1 }}
                    transition={{ duration: 1, ease: 'easeInOut' }}
                    className="absolute inset-0"
                >
                    <div className={`absolute inset-0 ${animationType === 'kenburns' ? 'animate-kenburns' : ''}`}>
                        <Image
                            src={slide.imageUrl || '/placeholder.jpg'}
                            alt={slide.title || 'DUA'}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
                </motion.div>
            </AnimatePresence>

            {/* Content */}
            <div className="relative z-10 h-full flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentSlide}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="max-w-2xl"
                        >
                            {slide.title && (
                                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight">
                                    {slide.title}
                                </h1>
                            )}
                            {slide.subtitle && (
                                <p className="text-lg md:text-xl text-gray-300 mb-8">
                                    {slide.subtitle}
                                </p>
                            )}
                            <div className="flex flex-col sm:flex-row gap-4">
                                {slide.buttonText && slide.buttonLink && (
                                    <Link href={slide.buttonLink} className="btn-primary">
                                        {slide.buttonText}
                                    </Link>
                                )}
                                <Link href="/donate" className="btn-outline">
                                    Support Our Cause
                                </Link>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Navigation Arrows */}
            {slides.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full glass flex items-center justify-center text-white hover:bg-gold-500/20 transition-colors"
                        aria-label="Previous slide"
                    >
                        <FiChevronLeft size={24} />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full glass flex items-center justify-center text-white hover:bg-gold-500/20 transition-colors"
                        aria-label="Next slide"
                    >
                        <FiChevronRight size={24} />
                    </button>
                </>
            )}

            {/* Dots Indicator */}
            {slides.length > 1 && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide
                                    ? 'bg-gold-500 w-8'
                                    : 'bg-white/30 hover:bg-white/50'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="absolute bottom-8 right-8 z-20 hidden md:block"
            >
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="flex flex-col items-center gap-2 text-gray-400"
                >
                    <span className="text-xs uppercase tracking-wider">Scroll</span>
                    <div className="w-px h-12 bg-gradient-to-b from-gold-500 to-transparent" />
                </motion.div>
            </motion.div>
        </section>
    );
}
