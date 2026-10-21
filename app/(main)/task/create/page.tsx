import type { Metadata } from 'next';
import { getAvailableLoaners } from '@/lib/data/loaners';
import { getUsers } from '@/lib/data/users';
import { requireUser } from '@/lib/session';
import CreateTaskForm from './CreateTaskForm';

export const metadata: Metadata = { title: 'New Task' };

export default async function CreateTaskPage() {
    const [user, loaners, users] = await Promise.all([requireUser(), getAvailableLoaners(), getUsers()]);
    return <CreateTaskForm allLoaners={loaners} users={users} currentUserId={user.id} />;
}
