import Link from 'next/link';
import type { ReactNode } from 'react';

// Page numbers to show: the first two, the last two and three either side of
// the current page, with null marking a gap.
function pageWindow(current: number, last: number) {
    const pages: (number | null)[] = [];
    for (let p = 1; p <= last; p++) {
        if (p <= 2 || p > last - 2 || Math.abs(p - current) <= 3) pages.push(p);
        else if (pages.at(-1) !== null) pages.push(null);
    }
    return pages;
}

const itemClass = 'flex items-center justify-center text-sm py-2 px-3 leading-tight border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-white';
const activeClass = ' text-primary-600 bg-primary-50 dark:bg-gray-700 dark:text-white dark:border-gray-700';
const inactiveClass = ' text-gray-500 bg-white dark:border-gray-700 dark:text-gray-400 dark:bg-gray-800';
const arrowClass = 'flex items-center justify-center h-full py-1.5 px-3 text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white';

/**
 * Pagination footer. Pass `hrefForPage` to render links (server-side paging)
 * or `onPage` to render buttons (client-side paging).
 */
type TableNavigationProps = {
    total: number;
    pageSize: number;
    currentPage: number;
    hrefForPage?: (page: number) => string;
    onPage?: (page: number) => void;
};

type PageLinkProps = { page: number; className: string; children: ReactNode; label?: string };

export default function TableNavigation({ total, pageSize, currentPage, hrefForPage, onPage }: TableNavigationProps) {
    const lastPage = Math.max(1, Math.ceil(total / pageSize));
    const from = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const to = Math.min(currentPage * pageSize, total);

    const PageLink = ({ page, className, children, label }: PageLinkProps) => {
        const target = Math.min(Math.max(page, 1), lastPage);
        if (hrefForPage) return <Link href={hrefForPage(target)} className={className} aria-label={label}>{children}</Link>;
        return <button type="button" onClick={() => onPage?.(target)} className={className} aria-label={label}>{children}</button>;
    };

    return (
        <nav className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 px-4 py-3 border-t border-gray-200 dark:border-gray-700" aria-label="Table navigation">
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                Showing <span className="font-semibold text-gray-900 dark:text-white">{from} - {to}</span> of{' '}
                <span className="font-semibold text-gray-900 dark:text-white">{total}</span>
            </span>
            <ul className="inline-flex flex-wrap items-stretch -space-x-px">
                <li>
                    <PageLink page={currentPage - 1} className={`${arrowClass} ml-0 rounded-l-lg`} label="Previous">
                        <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </PageLink>
                </li>
                {pageWindow(currentPage, lastPage).map((page, i) => (
                    <li key={page ?? `gap-${i}`}>
                        {page === null
                            ? <span className={itemClass + inactiveClass}>...</span>
                            : <PageLink page={page} className={itemClass + (page === currentPage ? activeClass : inactiveClass)}>{page}</PageLink>}
                    </li>
                ))}
                <li>
                    <PageLink page={currentPage + 1} className={`${arrowClass} rounded-r-lg`} label="Next">
                        <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                    </PageLink>
                </li>
            </ul>
        </nav>
    );
}
