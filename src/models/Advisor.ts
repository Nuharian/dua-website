import mongoose, { Schema, Document } from 'mongoose';

export interface IAdvisor extends Document {
    name: string;
    title: string;
    credentials: string;
    organization: string;
    photo?: string;
    bio?: string;
    email?: string;
    order: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const AdvisorSchema = new Schema<IAdvisor>(
    {
        name: { type: String, required: true },
        title: { type: String, required: true },
        credentials: String,
        organization: String,
        photo: String,
        bio: String,
        email: String,
        order: { type: Number, default: 0 },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default mongoose.models.Advisor || mongoose.model<IAdvisor>('Advisor', AdvisorSchema);
