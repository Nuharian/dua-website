import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import AdminSidebar from '@/components/admin/Sidebar';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/admin/login');
    }

    return (
        <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
            <AdminSidebar />
            <main className="admin-container">
                {children}
            </main>
        </div>
    );
}
