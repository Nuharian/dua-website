'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function AnalyticsTracker() {
    const pathname = usePathname();
    const tracked = useRef<Set<string>>(new Set());
    const sessionId = useRef<string>('');

    useEffect(() => {
        // Generate session ID if not exists
        if (!sessionId.current) {
            sessionId.current = typeof window !== 'undefined'
                ? sessionStorage.getItem('dua_session') || crypto.randomUUID()
                : '';
            if (typeof window !== 'undefined') {
                sessionStorage.setItem('dua_session', sessionId.current);
            }
        }
    }, []);

    useEffect(() => {
        // Don't track admin pages
        if (pathname.startsWith('/admin')) return;

        // Don't track same page twice in same session
        if (tracked.current.has(pathname)) return;
        tracked.current.add(pathname);

        // Get device info
        const getDeviceType = () => {
            const ua = navigator.userAgent;
            if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
                return 'tablet';
            }
            if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
                return 'mobile';
            }
            return 'desktop';
        };

        const getBrowser = () => {
            const ua = navigator.userAgent;
            if (ua.includes('Firefox')) return 'Firefox';
            if (ua.includes('Chrome') && !ua.includes('Edg')) return 'Chrome';
            if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
            if (ua.includes('Edg')) return 'Edge';
            if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera';
            return 'Other';
        };

        // Send analytics data
        const trackVisit = async () => {
            try {
                await fetch('/api/analytics', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        sessionId: sessionId.current,
                        page: pathname,
                        referrer: document.referrer || undefined,
                        device: getDeviceType(),
                        browser: getBrowser(),
                        screenWidth: window.screen.width,
                        screenHeight: window.screen.height,
                        language: navigator.language,
                        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    }),
                });
            } catch {
                // Silent fail - analytics shouldn't break the site
            }
        };

        // Small delay to ensure page is loaded
        const timer = setTimeout(trackVisit, 100);
        return () => clearTimeout(timer);
    }, [pathname]);

    return null;
}
