import mongoose, { Schema, Document } from 'mongoose';

export interface IInitiative extends Document {
    title: string;
    slug: string;
    description: string;
    excerpt: string;
    featuredImage?: string;
    images: string[];
    category: 'healthcare' | 'education' | 'welfare' | 'environment' | 'other';
    status: 'passed' | 'ongoing' | 'upcoming';
    startDate?: Date;
    endDate?: Date;
    location?: string;
    beneficiaries?: number;
    isHighlighted: boolean;
    order: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const InitiativeSchema = new Schema<IInitiative>(
    {
        title: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        description: { type: String, required: true },
        excerpt: String,
        featuredImage: String,
        images: [String],
        category: {
            type: String,
            enum: ['healthcare', 'education', 'welfare', 'environment', 'other'],
            default: 'other'
        },
        status: {
            type: String,
            enum: ['passed', 'ongoing', 'upcoming'],
            default: 'ongoing'
        },
        startDate: Date,
        endDate: Date,
        location: String,
        beneficiaries: Number,
        isHighlighted: { type: Boolean, default: false },
        order: { type: Number, default: 0 },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default mongoose.models.Initiative || mongoose.model<IInitiative>('Initiative', InitiativeSchema);
