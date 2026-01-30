import mongoose, { Schema, Document } from 'mongoose';

export interface IImpactPost extends Document {
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    featuredImage?: string;
    images: string[];
    category: string;
    beneficiaryCount?: number;
    areasImpacted: string[];
    tags: string[];
    author?: string;
    publishedAt?: Date;
    isPublished: boolean;
    viewCount: number;
    createdAt: Date;
    updatedAt: Date;
}

const ImpactPostSchema = new Schema<IImpactPost>(
    {
        title: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        content: { type: String, required: true },
        excerpt: String,
        featuredImage: String,
        images: [String],
        category: { type: String, default: 'general' },
        beneficiaryCount: Number,
        areasImpacted: [String],
        tags: [String],
        author: String,
        publishedAt: Date,
        isPublished: { type: Boolean, default: false },
        viewCount: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export default mongoose.models.ImpactPost || mongoose.model<IImpactPost>('ImpactPost', ImpactPostSchema);
