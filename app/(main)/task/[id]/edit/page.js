import { notFound } from 'next/navigation';
import UpdateTaskForm from '@/components/Task/UpdateTaskForm';
import { getStatuses, getTask } from '@/lib/data/tasks';

export const metadata = { title: 'Update Task' };

export default async function EditTaskPage({ params }) {
    const id = Number((await params).id);
    if (!Number.isInteger(id)) notFound();

    const [task, status] = await Promise.all([getTask(id), getStatuses()]);
    if (!task) notFound();

    return <UpdateTaskForm task={task} status={status} />;
}
