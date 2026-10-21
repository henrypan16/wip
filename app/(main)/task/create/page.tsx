import type { Metadata } from 'next';
import { getActiveCategories, getLoanerGroupLinks, getLoanersInService } from '@/lib/data/loaners';
import { getUsers } from '@/lib/data/users';
import { requireUser } from '@/lib/session';
import CreateTaskForm from './CreateTaskForm';

export const metadata: Metadata = { title: 'New Task' };

export default async function CreateTaskPage() {
    const [user, loaners, groups, categories, users] = await Promise.all([
        requireUser(), getLoanersInService(), getLoanerGroupLinks(), getActiveCategories(), getUsers(),
    ]);
    return <CreateTaskForm allLoaners={loaners} groups={groups} categories={categories} users={users} currentUserId={user.id} />;
}
