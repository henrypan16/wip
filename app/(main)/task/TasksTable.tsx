'use client';

import { cardClass, FilterPills, ListToolbar } from '@/components/Page';
import StatusBadge, { STATUS_COLORS, DEFAULT_STATUS_COLOR, statusName } from '@/components/StatusBadge';
import TableData, { type Column } from '@/components/Table/TableData';
import TableNavigation from '@/components/Table/TableNavigation';
import TableSearchBar from '@/components/Table/TableSearchBar';
import useTaskSearch from '@/components/useTaskSearch';
import { PAGE_SIZE } from '@/lib/constants';
import { formatDate, padCustomerId } from '@/lib/format';
import type { Status, Task, TaskPage } from '@/lib/types';

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
    const query = useTaskSearch();
    const statusLabel = (id: string) => statuses.find((s) => String(s.id) === String(id))?.name ?? '';

    // Less important columns drop out on narrower screens.
    const columns: Column<Task>[] = [
        {
            key: 'equipment',
            label: 'Task',
            render: (task) => (
                <>
                    <p className="font-medium text-gray-900 dark:text-white truncate">{task.equipment}</p>
                    <p className="text-xs truncate">{task.problem}</p>
                </>
            ),
        },
        {
            key: 'customer',
            label: 'Customer',
            className: 'hidden sm:table-cell w-56',
            render: (task) => (
                <>
                    <p className="font-mono text-gray-900 dark:text-white">{padCustomerId(task.customer_id)}</p>
                    <p className="text-xs truncate">{task.customer_name}</p>
                </>
            ),
        },
        { key: 'service_order', label: 'SO#', className: 'hidden md:table-cell w-28 font-mono', render: (task) => (task.service_order ? `SO#${task.service_order}` : '—') },
        { key: 'loaner', label: 'Loaners', className: 'hidden lg:table-cell w-44', render: (task) => task.loaner || '—' },
        { key: 'date', label: 'Received', className: 'hidden md:table-cell w-28', render: (task) => formatDate(task.date) },
        { key: 'status', label: 'Status', className: 'w-32', render: (task) => <StatusBadge id={task.status_id} label={statusLabel(task.status_id)} /> },
    ];

    const filters = [
        { value: '', label: 'All' },
        ...statuses.map((s) => ({ value: String(s.id), label: statusName(s.name), activeClass: STATUS_COLORS[s.id] ?? DEFAULT_STATUS_COLOR })),
    ];

    return (
        <div className={cardClass}>
            <ListToolbar>
                <TableSearchBar value={query.value} onChange={query.setValue} onSubmit={query.submit} placeholder="Search customer, SO#, equipment…" />
                <FilterPills label="Status" options={filters} value={status} href={(value) => tasksUrl({ search, status: value })} />
            </ListToolbar>
            <TableData columns={columns} rows={tasks.data} rowHref={(task) => `/task/${task.id}/edit`} empty="No tasks found." />
            <TableNavigation total={tasks.total} pageSize={PAGE_SIZE} currentPage={tasks.currentPage}
                hrefForPage={(page) => tasksUrl({ search, status, page })} />
        </div>
    );
}
