import mongoose, { Schema, Document } from 'mongoose';

export interface IDonationOption extends Document {
    type: 'bank' | 'bkash' | 'nagad' | 'rocket' | 'upay' | 'other';
    name: string;
    accountNumber: string;
    accountName?: string;
    bankName?: string;
    branchName?: string;
    routingNumber?: string;
    instructions?: string;
    qrCode?: string;
    icon?: string;
    isActive: boolean;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}

const DonationOptionSchema = new Schema<IDonationOption>(
    {
        type: {
            type: String,
            enum: ['bank', 'bkash', 'nagad', 'rocket', 'upay', 'other'],
            required: true
        },
        name: { type: String, required: true },
        accountNumber: { type: String, required: true },
        accountName: String,
        bankName: String,
        branchName: String,
        routingNumber: String,
        instructions: String,
        qrCode: String,
        icon: String,
        isActive: { type: Boolean, default: true },
        order: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export default mongoose.models.DonationOption || mongoose.model<IDonationOption>('DonationOption', DonationOptionSchema);
