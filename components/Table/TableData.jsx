'use client';

import { useRouter } from 'next/navigation';

/**
 * @param {{key: string, label: string, className?: string}[]} columns
 * @param {object[]} rows
 * @param {(row) => string} [rowHref] makes each row a link
 */
export default function TableData({ columns, rows, rowHref }) {
    const router = useRouter();

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 table-fixed">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        {columns.map((column) => (
                            <th key={column.key} scope="col" className={`${column.className ?? ''} px-4 py-3 truncate`}>{column.label}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.length === 0 && (
                        <tr>
                            <td colSpan={columns.length} className="px-4 py-6 text-center">No results found.</td>
                        </tr>
                    )}
                    {rows.map((row) => (
                        <tr key={row.id}
                            className={`border-b dark:border-gray-700 ${rowHref ? 'hover:bg-gray-100 dark:hover:bg-gray-700 hover:cursor-pointer' : ''}`}
                            onClick={rowHref ? () => router.push(rowHref(row)) : undefined}>
                            {columns.map((column) => (
                                <td key={column.key} className="px-4 py-3 truncate" title={String(row[column.key] ?? '')}>{row[column.key]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
