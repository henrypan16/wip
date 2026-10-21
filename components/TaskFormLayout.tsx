import Link from 'next/link';
import type { FormEvent, ReactNode } from 'react';

// Page shell shared by the create and update task forms: a compact header and a
// card with two columns of titled sections on wide screens, then the actions.

type FormPageProps = { title: string; subtitle?: ReactNode; onSubmit: (e: FormEvent<HTMLFormElement>) => void; children: ReactNode };

export function FormPage({ title, subtitle, onSubmit, children }: FormPageProps) {
    return (
        <div className="h-full overflow-y-auto">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10 py-4">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                        <svg className="w-3 h-3" aria-hidden="true" fill="none" viewBox="0 0 8 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 1 1.3 6.326a.91.91 0 0 0 0 1.348L7 13" />
                        </svg>
                        Dashboard
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
                    {subtitle && <div className="text-gray-500 dark:text-gray-400">{subtitle}</div>}
                </div>

                <form onSubmit={onSubmit} className="mt-4 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
                    {children}
                </form>
            </div>
        </div>
    );
}

/** Two side-by-side columns of sections on large screens, stacked below that. */
export function FormColumns({ children }: { children: ReactNode }) {
    return (
        <div className="grid lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-200 dark:divide-gray-700">
            {children}
        </div>
    );
}

export function FormColumn({ children }: { children: ReactNode }) {
    return <div className="divide-y divide-gray-200 dark:divide-gray-700">{children}</div>;
}

export function FormSection({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
    return (
        <section className="px-5 py-4">
            <h2 className="font-semibold text-gray-900 dark:text-white">
                {title}
                {description && <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">{description}</span>}
            </h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-6">{children}</div>
        </section>
    );
}

export function FormActions({ submitLabel, processing }: { submitLabel: string; processing: boolean }) {
    return (
        <div className="flex justify-end gap-2 px-5 py-3 bg-gray-50 border-t border-gray-200 rounded-b-xl dark:bg-gray-800/50 dark:border-gray-700">
            <Link href="/dashboard"
                className="text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700">
                Cancel
            </Link>
            <button type="submit" disabled={processing}
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-hidden dark:focus:ring-blue-800 disabled:opacity-60">
                {processing ? 'Saving…' : submitLabel}
            </button>
        </div>
    );
}
