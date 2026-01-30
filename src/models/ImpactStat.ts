import mongoose, { Schema, Document } from 'mongoose';

export interface IImpactStat extends Document {
    label: string;
    value: string;
    description?: string;
    icon?: string;
    order: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const ImpactStatSchema = new Schema<IImpactStat>(
    {
        label: { type: String, required: true },
        value: { type: String, required: true },
        description: String,
        icon: String,
        order: { type: Number, default: 0 },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default mongoose.models.ImpactStat || mongoose.model<IImpactStat>('ImpactStat', ImpactStatSchema);
