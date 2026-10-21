import Link from 'next/link';
import type { ReactNode } from 'react';

// Building blocks shared by the dashboard, tasks and loaners pages so they look alike.

export const primaryButtonClass = 'inline-flex items-center justify-center gap-1 shrink-0 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-hidden dark:focus:ring-blue-800 disabled:opacity-60';

export const secondaryButtonClass = 'inline-flex items-center justify-center shrink-0 text-gray-700 bg-white border border-gray-200 hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700 focus:outline-hidden';

export const cardClass = 'bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700';

/** A scrolling page with the standard width and padding. */
export function Page({ children }: { children: ReactNode }) {
    return (
        <div className="h-full overflow-y-auto">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10 py-4 flex flex-col gap-4">{children}</div>
        </div>
    );
}

/** The title, count pills and the page's main action on one row. */
export function PageHeader({ title, counts, action, countsClassName = 'flex' }: {
    title: string;
    counts?: ReactNode;
    action?: ReactNode;
    /** Display classes for the counts, e.g. to hide them on small screens. */
    countsClassName?: string;
}) {
    return (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
            <div className={`${countsClassName} flex-1 flex-wrap items-center gap-2`}>{counts}</div>
            {action && <div className="ml-auto">{action}</div>}
        </div>
    );
}

export function CountPill({ label, value, dot }: { label: string; value: number; dot: string }) {
    return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs sm:text-sm rounded-full bg-white border border-gray-200 text-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300">
            <span className={`w-2 h-2 rounded-full ${dot}`} />
            {label}
            <span className="font-semibold text-gray-900 dark:text-white">{value}</span>
        </span>
    );
}

/** Search and filters above a table, inside its card. */
export function ListToolbar({ children }: { children: ReactNode }) {
    return <div className="flex flex-col gap-3 p-4 border-b border-gray-200 dark:border-gray-700">{children}</div>;
}

export type FilterOption = { value: string; label: string; /** Colours when selected. */ activeClass?: string };

const ACTIVE_FILTER = 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';

/** One-of-many filter shown as pills. Pass `href` for links (server filtering) or `onSelect` for buttons. */
export function FilterPills({ label, options, value, href, onSelect }: {
    label: string;
    options: FilterOption[];
    value: string;
    href?: (value: string) => string;
    onSelect?: (value: string) => void;
}) {
    return (
        <div role="group" aria-label={label} className="flex flex-wrap gap-2">
            {options.map((option) => {
                const active = option.value === value;
                const className = `px-3 py-1 text-sm font-medium rounded-full border transition ${active
                    ? `${option.activeClass ?? ACTIVE_FILTER} border-transparent ring-2 ring-offset-1 ring-current dark:ring-offset-gray-800`
                    : 'border-gray-300 text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'}`;
                return href
                    ? <Link key={option.value} href={href(option.value)} className={className} aria-current={active ? 'true' : undefined}>{option.label}</Link>
                    : <button key={option.value} type="button" onClick={() => onSelect?.(option.value)} className={className} aria-pressed={active}>{option.label}</button>;
            })}
        </div>
    );
}
