import type { Metadata } from 'next';
import { requireUser } from '@/lib/session';
import ProfileForms from './ProfileForms';

export const metadata: Metadata = { title: 'Profile' };

export default async function ProfilePage() {
    const user = await requireUser();
    return <ProfileForms user={{ name: user.name, email: user.email }} />;
}
