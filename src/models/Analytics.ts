import mongoose, { Schema, Document } from 'mongoose';

export interface IPageView {
    path: string;
    title?: string;
    timestamp: Date;
    duration?: number;
}

export interface IAnalytics extends Document {
    sessionId: string;
    visitorId: string;
    ipAddress?: string;
    country?: string;
    city?: string;
    region?: string;
    device: 'desktop' | 'mobile' | 'tablet';
    browser?: string;
    os?: string;
    referrer?: string;
    pageViews: IPageView[];
    entryPage: string;
    exitPage?: string;
    createdAt: Date;
    lastActivity: Date;
}

const AnalyticsSchema = new Schema<IAnalytics>(
    {
        sessionId: { type: String, required: true, index: true },
        visitorId: { type: String, required: true, index: true },
        ipAddress: String,
        country: String,
        city: String,
        region: String,
        device: {
            type: String,
            enum: ['desktop', 'mobile', 'tablet'],
            default: 'desktop'
        },
        browser: String,
        os: String,
        referrer: String,
        pageViews: [{
            path: { type: String, required: true },
            title: String,
            timestamp: { type: Date, default: Date.now },
            duration: Number,
        }],
        entryPage: { type: String, required: true },
        exitPage: String,
        lastActivity: { type: Date, default: Date.now },
    },
    {
        timestamps: true,
    }
);

// Index for efficient querying
AnalyticsSchema.index({ createdAt: -1 });
AnalyticsSchema.index({ country: 1 });

export default mongoose.models.Analytics || mongoose.model<IAnalytics>('Analytics', AnalyticsSchema);
