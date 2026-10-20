import Link from 'next/link';
import TasksTable from '@/components/Task/TasksTable';
import { getStatuses, getTaskPage } from '@/lib/data/tasks';

export const metadata = { title: 'All Tasks' };

const reportLinkClass = 'px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white';

export default async function TasksPage({ searchParams }) {
    const params = await searchParams;
    const search = typeof params.search === 'string' ? params.search.trim().slice(0, 100) : '';
    const status = typeof params.status === 'string' ? params.status : '';
    const page = Math.max(1, Number.parseInt(params.page, 10) || 1);

    const [tasks, statuses] = await Promise.all([getTaskPage({ page, search, status }), getStatuses()]);

    return (
        <section className="bg-gray-50 dark:bg-gray-900 mr-4 sm:p-5 w-full 2xl:w-3/4 2xl:ml-32">
            <div className="mx-auto px-4 lg:px-12 flex flex-wrap items-start justify-between">
                <h1 className="text-3xl text-gray-900 dark:text-white mb-6">View All Task</h1>
                {/* Printable reports; hidden as in the original app until they are finished. */}
                <div className="hidden rounded-md shadow-sm">
                    <Link href="/report/ready" target="_blank" className={`${reportLinkClass} rounded-s-lg`}>Ready</Link>
                    <Link href="/report/action" target="_blank" className={reportLinkClass}>Action</Link>
                    <Link href="/report/repair" target="_blank" className={`${reportLinkClass} rounded-e-lg`}>Repair</Link>
                </div>
                <TasksTable tasks={tasks} search={search} status={status} statuses={statuses} />
            </div>
        </section>
    );
}
