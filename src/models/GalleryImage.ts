import mongoose, { Schema, Document } from 'mongoose';

export interface IGalleryImage extends Document {
    title: string;
    description?: string;
    imageUrl: string;
    thumbnailUrl?: string;
    category: string;
    event?: string;
    order: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const GalleryImageSchema = new Schema<IGalleryImage>(
    {
        title: { type: String, required: true },
        description: String,
        imageUrl: { type: String, required: true },
        thumbnailUrl: String,
        category: { type: String, default: 'general' },
        event: String,
        order: { type: Number, default: 0 },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default mongoose.models.GalleryImage || mongoose.model<IGalleryImage>('GalleryImage', GalleryImageSchema);
