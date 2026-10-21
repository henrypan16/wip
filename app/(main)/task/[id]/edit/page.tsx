import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getActiveCategories, getLoanerGroupLinks, getLoanersInService, getTaskLoaners } from '@/lib/data/loaners';
import { getStatuses, getTask } from '@/lib/data/tasks';
import { getUsers } from '@/lib/data/users';
import UpdateTaskForm from './UpdateTaskForm';

export const metadata: Metadata = { title: 'Update Task' };

export default async function EditTaskPage({ params }: { params: Promise<{ id: string }> }) {
    const id = Number((await params).id);
    if (!Number.isInteger(id)) notFound();

    const [task, status, users, taskLoaners, loaners, groups, categories] = await Promise.all([
        getTask(id), getStatuses(), getUsers(), getTaskLoaners(id), getLoanersInService(), getLoanerGroupLinks(), getActiveCategories(),
    ]);
    if (!task) notFound();

    return <UpdateTaskForm task={task} status={status} users={users} taskLoaners={taskLoaners} loaners={loaners} groups={groups} categories={categories} />;
}
