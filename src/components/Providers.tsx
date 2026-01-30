'use client';

import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            {children}
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#1a1a1a',
                        color: '#fff',
                        border: '1px solid rgba(251, 191, 36, 0.3)',
                    },
                    success: {
                        iconTheme: {
                            primary: '#fbbf24',
                            secondary: '#0a0a0a',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#ef4444',
                            secondary: '#0a0a0a',
                        },
                    },
                }}
            />
        </SessionProvider>
    );
}
