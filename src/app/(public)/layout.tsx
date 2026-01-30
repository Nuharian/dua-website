import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import AnalyticsTracker from '@/components/public/AnalyticsTracker';

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <AnalyticsTracker />
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
        </>
    );
}
