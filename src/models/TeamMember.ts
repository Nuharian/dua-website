import mongoose, { Schema, Document } from 'mongoose';

export interface ITeamMember extends Document {
    name: string;
    role: string;
    designation: string;
    organization: string;
    photo?: string;
    bio?: string;
    email?: string;
    socialLinks?: {
        linkedin?: string;
        facebook?: string;
        twitter?: string;
    };
    type: 'founder' | 'co_founder' | 'member';
    order: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const TeamMemberSchema = new Schema<ITeamMember>(
    {
        name: { type: String, required: true },
        role: { type: String, required: true },
        designation: String,
        organization: String,
        photo: String,
        bio: String,
        email: String,
        socialLinks: {
            linkedin: String,
            facebook: String,
            twitter: String,
        },
        type: {
            type: String,
            enum: ['founder', 'co_founder', 'member'],
            default: 'member'
        },
        order: { type: Number, default: 0 },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default mongoose.models.TeamMember || mongoose.model<ITeamMember>('TeamMember', TeamMemberSchema);
