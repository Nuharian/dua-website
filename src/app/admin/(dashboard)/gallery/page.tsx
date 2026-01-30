'use client';

import { useState, useEffect, useCallback } from 'react';
import { FiPlus, FiTrash2, FiImage, FiUpload, FiX } from 'react-icons/fi';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';

interface GalleryImage {
    _id: string;
    title: string;
    description?: string;
    imageUrl: string;
    category: string;
    event?: string;
    isActive: boolean;
    order: number;
}

export default function GalleryPage() {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [uploadForm, setUploadForm] = useState({
        category: 'events',
        event: '',
    });

    const categories = ['events', 'healthcare', 'education', 'team', 'donation', 'other'];

    const fetchImages = async () => {
        try {
            const res = await fetch('/api/gallery?active=false');
            const data = await res.json();
            setImages(data);
        } catch {
            toast.error('Failed to load images');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchImages();
    }, []);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;

        setUploading(true);
        let successCount = 0;

        for (const file of acceptedFiles) {
            try {
                // Upload to Cloudinary (using unsigned upload)
                const formData = new FormData();
                formData.append('file', file);
                formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'dua_uploads');

                const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
                const uploadRes = await fetch(
                    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                    { method: 'POST', body: formData }
                );

                if (!uploadRes.ok) {
                    toast.error(`Failed to upload ${file.name}`);
                    continue;
                }

                const cloudData = await uploadRes.json();

                // Save to database
                const res = await fetch('/api/gallery', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title: file.name.replace(/\.[^/.]+$/, ''),
                        imageUrl: cloudData.secure_url,
                        publicId: cloudData.public_id,
                        category: uploadForm.category,
                        event: uploadForm.event || undefined,
                    }),
                });

                if (res.ok) {
                    successCount++;
                }
            } catch {
                toast.error(`Failed to upload ${file.name}`);
            }
        }

        if (successCount > 0) {
            toast.success(`${successCount} image${successCount > 1 ? 's' : ''} uploaded!`);
            fetchImages();
        }

        setUploading(false);
        setIsModalOpen(false);
    }, [uploadForm]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif'] },
        disabled: uploading,
    });

    const toggleSelect = (id: string) => {
        setSelectedImages((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const handleDeleteSelected = async () => {
        if (selectedImages.length === 0) return;
        if (!confirm(`Delete ${selectedImages.length} image(s)?`)) return;

        let deleted = 0;
        for (const id of selectedImages) {
            try {
                const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
                if (res.ok) deleted++;
            } catch {
                // Continue
            }
        }

        toast.success(`${deleted} image(s) deleted`);
        setSelectedImages([]);
        fetchImages();
    };

    const groupedImages = images.reduce((acc, img) => {
        if (!acc[img.category]) acc[img.category] = [];
        acc[img.category].push(img);
        return acc;
    }, {} as Record<string, GalleryImage[]>);

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Gallery</h1>
                    <p className="text-gray-400 mt-1">Manage your photo gallery</p>
                </div>
                <div className="flex gap-3">
                    {selectedImages.length > 0 && (
                        <button
                            onClick={handleDeleteSelected}
                            className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors flex items-center gap-2"
                        >
                            <FiTrash2 />
                            Delete ({selectedImages.length})
                        </button>
                    )}
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="btn-primary flex items-center gap-2"
                    >
                        <FiPlus />
                        Upload Images
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="spinner" />
                </div>
            ) : images.length > 0 ? (
                <div className="space-y-8">
                    {Object.entries(groupedImages).map(([category, categoryImages]) => (
                        <div key={category}>
                            <h2 className="text-lg font-semibold text-white mb-4 capitalize">{category}</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {categoryImages.map((image) => (
                                    <div
                                        key={image._id}
                                        onClick={() => toggleSelect(image._id)}
                                        className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer group ${selectedImages.includes(image._id) ? 'ring-2 ring-gold-500' : ''
                                            } ${!image.isActive ? 'opacity-50' : ''}`}
                                    >
                                        <img
                                            src={image.imageUrl}
                                            alt={image.title}
                                            className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <p className="text-white text-sm px-3 text-center truncate">
                                                {image.title}
                                            </p>
                                        </div>
                                        {selectedImages.includes(image._id) && (
                                            <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gold-500 flex items-center justify-center">
                                                <span className="text-black text-xs font-bold">✓</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 card">
                    <FiImage className="text-gray-600 mx-auto mb-3" size={48} />
                    <p className="text-gray-400 mb-4">No images yet</p>
                    <button onClick={() => setIsModalOpen(true)} className="btn-primary">
                        Upload Your First Image
                    </button>
                </div>
            )}

            {/* Upload Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/70" onClick={() => !uploading && setIsModalOpen(false)} />
                    <div className="relative bg-zinc-900 rounded-2xl p-6 w-full max-w-lg">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white">Upload Images</h2>
                            <button
                                onClick={() => !uploading && setIsModalOpen(false)}
                                className="text-gray-400 hover:text-white"
                                disabled={uploading}
                            >
                                <FiX size={24} />
                            </button>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
                                <select
                                    value={uploadForm.category}
                                    onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                                    className="input-premium"
                                    disabled={uploading}
                                >
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat} className="capitalize">
                                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Event Name (optional)</label>
                                <input
                                    type="text"
                                    value={uploadForm.event}
                                    onChange={(e) => setUploadForm({ ...uploadForm, event: e.target.value })}
                                    className="input-premium"
                                    placeholder="e.g., Healthcamp 2024"
                                    disabled={uploading}
                                />
                            </div>
                        </div>

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
                            ) : isDragActive ? (
                                <p className="text-gold-400">Drop images here...</p>
                            ) : (
                                <div className="flex flex-col items-center gap-3">
                                    <FiUpload className="text-gray-500" size={32} />
                                    <p className="text-gray-400">
                                        Drag & drop images, or click to browse
                                    </p>
                                    <p className="text-gray-500 text-sm">
                                        Supports JPG, PNG, WebP, GIF
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
