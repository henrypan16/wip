import MainLayout from '@/components/Layout/MainLayout';
import { requireUser } from '@/lib/session';

// Every page reads live data from the Access database.
export const dynamic = 'force-dynamic';

export default async function Layout({ children }) {
    const user = await requireUser();
    return <MainLayout user={{ name: user.name, email: user.email }}>{children}</MainLayout>;
}
