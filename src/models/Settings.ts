import mongoose, { Schema, Document } from 'mongoose';

export interface ISocialLinks {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    tiktok?: string;
    linkedin?: string;
    twitter?: string;
}

export interface IEmergencyContact {
    name: string;
    phone: string;
    role?: string;
}

export interface IAnimationSettings {
    heroAnimation: 'fade' | 'slide' | 'zoom' | 'parallax' | 'kenburns';
    sectionAnimation: 'fadeUp' | 'slideIn' | 'stagger' | 'reveal';
    hoverEffect: 'glow' | 'lift' | 'ripple' | 'shine';
    enableParallax: boolean;
    enableSmoothScroll: boolean;
}

export interface ISettings extends Document {
    siteName: string;
    tagline: string;
    motto: string;
    logo?: string;
    favicon?: string;

    // About Content
    aboutIntro: string;
    aboutTheme: string;
    mission: string;
    vision: string;
    welcomeMessage: string;

    // Contact Details
    address: string;
    email: string;
    phone: string;
    website: string;
    emergencyContacts: IEmergencyContact[];
    googleMapsEmbed?: string;

    // Social Links
    socialLinks: ISocialLinks;

    // Animation Settings
    animations: IAnimationSettings;

    // Footer
    footerText?: string;
    copyrightText?: string;

    updatedAt: Date;
}

const SettingsSchema = new Schema<ISettings>(
    {
        siteName: { type: String, default: 'Development and Unity Alliance' },
        tagline: { type: String, default: 'Delivering Happiness' },
        motto: { type: String, default: 'Delivering Happiness, Through healthcare, education, and communal welfare initiatives across rural Bangladesh.' },
        logo: String,
        favicon: String,

        aboutIntro: { type: String, default: '' },
        aboutTheme: { type: String, default: '' },
        mission: { type: String, default: '' },
        vision: { type: String, default: '' },
        welcomeMessage: { type: String, default: '' },

        address: { type: String, default: '25/13C, Tajmahal Road, Mohammapur, Dhaka-1207, Bangladesh' },
        email: { type: String, default: 'Info@duabd.org' },
        phone: { type: String, default: '+8801743121942' },
        website: { type: String, default: 'www.duabd.org' },
        emergencyContacts: [{
            name: String,
            phone: String,
            role: String,
        }],
        googleMapsEmbed: String,

        socialLinks: {
            facebook: String,
            instagram: String,
            youtube: String,
            tiktok: String,
            linkedin: String,
            twitter: String,
        },

        animations: {
            heroAnimation: { type: String, enum: ['fade', 'slide', 'zoom', 'parallax', 'kenburns'], default: 'kenburns' },
            sectionAnimation: { type: String, enum: ['fadeUp', 'slideIn', 'stagger', 'reveal'], default: 'fadeUp' },
            hoverEffect: { type: String, enum: ['glow', 'lift', 'ripple', 'shine'], default: 'glow' },
            enableParallax: { type: Boolean, default: true },
            enableSmoothScroll: { type: Boolean, default: true },
        },

        footerText: String,
        copyrightText: { type: String, default: '© 2024 Development and Unity Alliance. All rights reserved.' },
    },
    { timestamps: true }
);

export default mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);
