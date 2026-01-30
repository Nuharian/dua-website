import mongoose, { Schema, Document } from 'mongoose';

export interface IPartner extends Document {
    name: string;
    description?: string;
    logo?: string;
    website?: string;
    location?: string;
    type: 'collaborator' | 'partner' | 'sponsor';
    order: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const PartnerSchema = new Schema<IPartner>(
    {
        name: { type: String, required: true },
        description: String,
        logo: String,
        website: String,
        location: String,
        type: {
            type: String,
            enum: ['collaborator', 'partner', 'sponsor'],
            default: 'partner'
        },
        order: { type: Number, default: 0 },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default mongoose.models.Partner || mongoose.model<IPartner>('Partner', PartnerSchema);
