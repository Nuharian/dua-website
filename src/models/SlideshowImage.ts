import mongoose, { Schema, Document } from 'mongoose';

export interface ICropArea {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface ISlideshowImage extends Document {
    imageUrl: string;
    title?: string;
    subtitle?: string;
    buttonText?: string;
    buttonLink?: string;
    order: number;
    isActive: boolean;
    cropArea?: ICropArea;
    createdAt: Date;
    updatedAt: Date;
}

const SlideshowImageSchema = new Schema<ISlideshowImage>(
    {
        imageUrl: { type: String, required: true },
        title: String,
        subtitle: String,
        buttonText: String,
        buttonLink: String,
        order: { type: Number, default: 0, min: 0, max: 9 },
        isActive: { type: Boolean, default: true },
        cropArea: {
            x: { type: Number, default: 0 },
            y: { type: Number, default: 0 },
            width: { type: Number, default: 100 },
            height: { type: Number, default: 100 },
        },
    },
    { timestamps: true }
);

export default mongoose.models.SlideshowImage || mongoose.model<ISlideshowImage>('SlideshowImage', SlideshowImageSchema);
