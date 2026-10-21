'use client';

import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';

export interface Column<T> {
    key: string;
    label: string;
    /** Applied to the header and cells, e.g. a width or `hidden md:table-cell`. */
    className?: string;
    /** Cell content; defaults to the row's value at `key`. */
    render?: (row: T) => ReactNode;
}

/** `rowHref` makes each row a link; `onRowClick` runs a handler instead. */
export default function TableData<T extends { id: number | string }>({ columns, rows, rowHref, onRowClick, empty = 'No results found.' }: {
    columns: Column<T>[];
    rows: T[];
    rowHref?: (row: T) => string;
    onRowClick?: (row: T) => void;
    empty?: string;
}) {
    const router = useRouter();
    const handleClick = onRowClick ?? (rowHref && ((row: T) => router.push(rowHref(row))));

    return (
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 table-fixed">
            <thead className="text-xs text-gray-500 uppercase tracking-wide bg-gray-50 dark:bg-gray-700/50 dark:text-gray-400">
                <tr>
                    {columns.map((column) => (
                        <th key={column.key} scope="col" className={`${column.className ?? ''} px-4 py-2.5 font-medium truncate`}>{column.label}</th>
                    ))}
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {rows.length === 0 && (
                    <tr>
                        <td colSpan={columns.length} className="px-4 py-10 text-center">{empty}</td>
                    </tr>
                )}
                {rows.map((row) => (
                    <tr key={row.id}
                        className={handleClick ? 'hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer' : ''}
                        onClick={handleClick ? () => handleClick(row) : undefined}>
                        {columns.map((column) => (
                            <td key={column.key} className={`${column.className ?? ''} px-4 py-3 truncate`}>
                                {column.render ? column.render(row) : ((row as Record<string, ReactNode>)[column.key] ?? '—')}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
