// Cloudinary upload utilities for DUA CMS

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'dua_unsigned';

export interface CloudinaryResponse {
    public_id: string;
    secure_url: string;
    url: string;
    width: number;
    height: number;
    format: string;
    resource_type: string;
    created_at: string;
    bytes: number;
}

export async function uploadToCloudinary(file: File, folder?: string): Promise<CloudinaryResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    if (folder) {
        formData.append('folder', `dua/${folder}`);
    }

    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
            method: 'POST',
            body: formData,
        }
    );

    if (!response.ok) {
        throw new Error('Failed to upload image to Cloudinary');
    }

    return response.json();
}

export async function deleteFromCloudinary(publicId: string): Promise<void> {
    // Note: For security, deletion should be done server-side with signed requests
    // This is handled in the API route
    const response = await fetch('/api/upload/delete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ publicId }),
    });

    if (!response.ok) {
        throw new Error('Failed to delete image from Cloudinary');
    }
}

export function getCloudinaryUrl(publicId: string, options?: {
    width?: number;
    height?: number;
    crop?: 'fill' | 'fit' | 'scale' | 'thumb';
    quality?: number;
}): string {
    const transforms = [];

    if (options?.width) transforms.push(`w_${options.width}`);
    if (options?.height) transforms.push(`h_${options.height}`);
    if (options?.crop) transforms.push(`c_${options.crop}`);
    if (options?.quality) transforms.push(`q_${options.quality}`);

    const transformString = transforms.length > 0 ? transforms.join(',') + '/' : '';

    return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transformString}${publicId}`;
}

export function getOptimizedImageUrl(url: string, width?: number): string {
    // If it's already a Cloudinary URL, add optimizations
    if (url.includes('cloudinary.com')) {
        const parts = url.split('/upload/');
        if (parts.length === 2) {
            const transforms = ['f_auto', 'q_auto'];
            if (width) transforms.push(`w_${width}`);
            return `${parts[0]}/upload/${transforms.join(',')}/${parts[1]}`;
        }
    }
    return url;
}
