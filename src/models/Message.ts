import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
    isRead: boolean;
    isReplied: boolean;
    repliedAt?: Date;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: String,
        subject: { type: String, required: true },
        message: { type: String, required: true },
        isRead: { type: Boolean, default: false },
        isReplied: { type: Boolean, default: false },
        repliedAt: Date,
        notes: String,
    },
    { timestamps: true }
);

// Index for efficient querying
MessageSchema.index({ isRead: 1, createdAt: -1 });

export default mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);
