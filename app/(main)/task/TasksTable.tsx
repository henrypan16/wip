'use client';

import Link from 'next/link';
import TableData from '@/components/Table/TableData';
import TableNavigation from '@/components/Table/TableNavigation';
import TableToolbar, { primaryButtonClass, PlusIcon, TableSearchBar, ToolbarDropdown } from '@/components/Table/TableToolbar';
import { PAGE_SIZE } from '@/lib/constants';
import { padCustomerId } from '@/lib/format';
import type { Status, TaskPage } from '@/lib/types';

const COLUMNS = [
    { key: 'customer_id', label: 'Customer#', className: 'w-32' },
    { key: 'customer_name', label: 'Pharmacy', className: 'w-64' },
    { key: 'service_order', label: 'SO#', className: 'w-24' },
    { key: 'problem', label: 'Problem', className: 'w-48' },
    { key: 'note', label: 'Note', className: 'w-48' },
    { key: 'loaner', label: 'Loaner', className: 'w-40' },
];

function tasksUrl({ search, status, page = 1 }: { search: string; status: string; page?: number }) {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (status) params.set('status', status);
    if (page > 1) params.set('page', String(page));
    const qs = params.toString();
    return qs ? `/task?${qs}` : '/task';
}

type TasksTableProps = { tasks: TaskPage; search: string; status: string; statuses: Status[] };

export default function TasksTable({ tasks, search, status, statuses }: TasksTableProps) {
    const rows = tasks.data.map((task) => ({ ...task, customer_id: padCustomerId(task.customer_id) }));
    const statusName = statuses.find((s) => s.id === status)?.name;

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md sm:rounded-lg w-full">
            <TableToolbar search={<TableSearchBar key={search} defaultValue={search} hidden={{ status }} />}>
                <Link href="/task/create" className={primaryButtonClass}>
                    {PlusIcon}
                    New Task
                </Link>
                <div className="flex items-center space-x-3 w-full md:w-auto">
                    <ToolbarDropdown label={statusName ?? 'Status'} title="Task Status">
                        {[{ id: '', name: 'All' }, ...statuses].map((option) => (
                            <li key={option.id}>
                                <Link href={tasksUrl({ search, status: option.id })}
                                    className={`block text-sm font-medium hover:text-primary-700 dark:hover:text-white ${option.id === status ? 'text-primary-700 dark:text-white' : 'text-gray-900 dark:text-gray-100'}`}>
                                    {option.name}
                                </Link>
                            </li>
                        ))}
                    </ToolbarDropdown>
                </div>
            </TableToolbar>
            <TableData columns={COLUMNS} rows={rows} rowHref={(task) => `/task/${task.id}/edit`} />
            <TableNavigation total={tasks.total} pageSize={PAGE_SIZE} currentPage={tasks.currentPage}
                hrefForPage={(page) => tasksUrl({ search, status, page })} />
        </div>
    );
}
