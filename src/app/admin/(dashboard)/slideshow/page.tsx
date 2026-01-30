'use client';

import { useState, useEffect, useCallback } from 'react';
import { FiPlus, FiTrash2, FiMove, FiUpload, FiX, FiImage } from 'react-icons/fi';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';

interface SlideshowImage {
    _id: string;
    imageUrl: string;
    title?: string;
    subtitle?: string;
    buttonText?: string;
    buttonLink?: string;
    isActive: boolean;
    order: number;
}

export default function SlideshowPage() {
    const [slides, setSlides] = useState<SlideshowImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSlide, setEditingSlide] = useState<SlideshowImage | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        buttonText: '',
        buttonLink: '',
        isActive: true,
    });

    const fetchSlides = async () => {
        try {
            const res = await fetch('/api/slideshow');
            const data = await res.json();
            setSlides(data);
        } catch {
            toast.error('Failed to load slides');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSlides();
    }, []);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;
        if (slides.length >= 10) {
            toast.error('Maximum 10 slides allowed');
            return;
        }

        setUploading(true);
        const file = acceptedFiles[0];

        try {
            // Upload to Cloudinary
            const uploadFormData = new FormData();
            uploadFormData.append('file', file);
            uploadFormData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'dua_uploads');

            const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
            const uploadRes = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                { method: 'POST', body: uploadFormData }
            );

            if (!uploadRes.ok) throw new Error('Upload failed');

            const cloudData = await uploadRes.json();

            // Save to database
            const res = await fetch('/api/slideshow', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    imageUrl: cloudData.secure_url,
                    publicId: cloudData.public_id,
                    ...formData,
                }),
            });

            if (res.ok) {
                toast.success('Slide added!');
                fetchSlides();
                setIsModalOpen(false);
                setFormData({ title: '', subtitle: '', buttonText: '', buttonLink: '', isActive: true });
            } else {
                const data = await res.json();
                toast.error(data.error || 'Failed to add slide');
            }
        } catch {
            toast.error('Upload failed');
        } finally {
            setUploading(false);
        }
    }, [slides.length, formData]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
        maxFiles: 1,
        disabled: uploading,
    });

    const openEditModal = (slide: SlideshowImage) => {
        setEditingSlide(slide);
        setFormData({
            title: slide.title || '',
            subtitle: slide.subtitle || '',
            buttonText: slide.buttonText || '',
            buttonLink: slide.buttonLink || '',
            isActive: slide.isActive,
        });
        setIsModalOpen(true);
    };

    const handleUpdate = async () => {
        if (!editingSlide) return;

        try {
            const res = await fetch(`/api/slideshow/${editingSlide._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                toast.success('Slide updated!');
                fetchSlides();
                closeModal();
            } else {
                toast.error('Update failed');
            }
        } catch {
            toast.error('An error occurred');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this slide?')) return;

        try {
            const res = await fetch(`/api/slideshow/${id}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success('Slide deleted');
                fetchSlides();
            } else {
                toast.error('Delete failed');
            }
        } catch {
            toast.error('An error occurred');
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingSlide(null);
        setFormData({ title: '', subtitle: '', buttonText: '', buttonLink: '', isActive: true });
    };

    const moveSlide = async (id: string, direction: 'up' | 'down') => {
        const currentIndex = slides.findIndex(s => s._id === id);
        if (
            (direction === 'up' && currentIndex === 0) ||
            (direction === 'down' && currentIndex === slides.length - 1)
        ) return;

        const newSlides = [...slides];
        const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
        [newSlides[currentIndex], newSlides[swapIndex]] = [newSlides[swapIndex], newSlides[currentIndex]];

        setSlides(newSlides);

        // Update orders in DB
        try {
            await fetch('/api/slideshow', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orders: newSlides.map((s, i) => ({ id: s._id, order: i })),
                }),
            });
        } catch {
            toast.error('Failed to reorder');
            fetchSlides();
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Homepage Slideshow</h1>
                    <p className="text-gray-400 mt-1">Manage hero section slides (max 10)</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    disabled={slides.length >= 10}
                    className="btn-primary flex items-center gap-2 disabled:opacity-50"
                >
                    <FiPlus />
                    Add Slide ({slides.length}/10)
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="spinner" />
                </div>
            ) : slides.length > 0 ? (
                <div className="space-y-4">
                    {slides.map((slide, index) => (
                        <div
                            key={slide._id}
                            className={`card flex items-center gap-6 ${!slide.isActive ? 'opacity-50' : ''}`}
                        >
                            {/* Order Controls */}
                            <div className="flex flex-col gap-1">
                                <button
                                    onClick={() => moveSlide(slide._id, 'up')}
                                    disabled={index === 0}
                                    className="p-1 rounded hover:bg-zinc-700 text-gray-400 hover:text-white disabled:opacity-30"
                                >
                                    ▲
                                </button>
                                <span className="text-center text-gray-500 text-sm">{index + 1}</span>
                                <button
                                    onClick={() => moveSlide(slide._id, 'down')}
                                    disabled={index === slides.length - 1}
                                    className="p-1 rounded hover:bg-zinc-700 text-gray-400 hover:text-white disabled:opacity-30"
                                >
                                    ▼
                                </button>
                            </div>

                            {/* Image */}
                            <div className="w-48 h-28 rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0">
                                <img
                                    src={slide.imageUrl}
                                    alt={slide.title || 'Slide'}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-white truncate">
                                    {slide.title || 'Untitled Slide'}
                                </h3>
                                {slide.subtitle && (
                                    <p className="text-gray-400 text-sm truncate mt-1">{slide.subtitle}</p>
                                )}
                                {slide.buttonText && (
                                    <p className="text-gold-400 text-sm mt-2">
                                        Button: &quot;{slide.buttonText}&quot; → {slide.buttonLink}
                                    </p>
                                )}
                                {!slide.isActive && (
                                    <span className="inline-block px-2 py-0.5 rounded text-xs bg-red-500/20 text-red-400 mt-2">
                                        Inactive
                                    </span>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => openEditModal(slide)}
                                    className="p-2 rounded-lg hover:bg-zinc-700 text-gray-400 hover:text-white transition-colors"
                                >
                                    <FiMove size={18} />
                                </button>
                                <button
                                    onClick={() => handleDelete(slide._id)}
                                    className="p-2 rounded-lg hover:bg-red-900/30 text-gray-400 hover:text-red-400 transition-colors"
                                >
                                    <FiTrash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 card">
                    <FiImage className="text-gray-600 mx-auto mb-3" size={48} />
                    <p className="text-gray-400 mb-4">No slides yet</p>
                    <button onClick={() => setIsModalOpen(true)} className="btn-primary">
                        Add Your First Slide
                    </button>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/70" onClick={() => !uploading && closeModal()} />
                    <div className="relative bg-zinc-900 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white">
                                {editingSlide ? 'Edit Slide' : 'Add Slide'}
                            </h2>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-white"
                                disabled={uploading}
                            >
                                <FiX size={24} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="input-premium"
                                    placeholder="e.g., Delivering Happiness"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Subtitle</label>
                                <textarea
                                    value={formData.subtitle}
                                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                    className="input-premium min-h-[80px]"
                                    placeholder="Brief description"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Button Text</label>
                                    <input
                                        type="text"
                                        value={formData.buttonText}
                                        onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                                        className="input-premium"
                                        placeholder="e.g., Learn More"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Button Link</label>
                                    <input
                                        type="text"
                                        value={formData.buttonLink}
                                        onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                                        className="input-premium"
                                        placeholder="e.g., /about"
                                    />
                                </div>
                            </div>

                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="w-4 h-4 rounded bg-zinc-700 border-zinc-600 text-gold-500"
                                />
                                <span className="text-gray-300">Active (visible on website)</span>
                            </label>

                            {!editingSlide && (
                                <div className="pt-4">
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Image *</label>
                                    <div
                                        {...getRootProps()}
                                        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${isDragActive
                                                ? 'border-gold-500 bg-gold-500/10'
                                                : 'border-zinc-600 hover:border-zinc-500'
                                            } ${uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                    >
                                        <input {...getInputProps()} />
                                        {uploading ? (
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="spinner" />
                                                <p className="text-gray-400">Uploading...</p>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-3">
                                                <FiUpload className="text-gray-500" size={32} />
                                                <p className="text-gray-400">Drop an image or click to browse</p>
                                                <p className="text-gray-500 text-sm">Recommended: 1920×1080 or larger</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {editingSlide && (
                                <div className="flex gap-3 pt-4">
                                    <button type="button" onClick={closeModal} className="btn-outline flex-1">
                                        Cancel
                                    </button>
                                    <button onClick={handleUpdate} className="btn-primary flex-1">
                                        Save Changes
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
