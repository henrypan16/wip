'use client';

import { useCallback, useRef, useState } from 'react';
import SearchIcon from '@/components/Navigation/SearchIcon';
import useClickOutside from '@/components/useClickOutside';

const searchInputClass = 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500';

export const toolbarButtonClass = 'w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-900 focus:outline-hidden bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700';

export const primaryButtonClass = 'flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-hidden dark:focus:ring-primary-800';

export default function TableToolbar({ search, children }) {
    return (
        <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
            <div className="w-full md:w-1/2">{search}</div>
            <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 shrink-0">
                {children}
            </div>
        </div>
    );
}

/** Search box. Controlled when `onChange` is given, otherwise a GET form field. */
export function TableSearchBar({ value, onChange, defaultValue, name = 'search', hidden = {} }) {
    const input = onChange
        ? <input type="text" id="table-search" className={searchInputClass} placeholder="Search" value={value} onChange={(e) => onChange(e.target.value)} />
        : <input type="text" id="table-search" name={name} className={searchInputClass} placeholder="Search" defaultValue={defaultValue} />;

    return (
        <form className="flex items-center" method="GET" onSubmit={onChange ? (e) => e.preventDefault() : undefined}>
            {Object.entries(hidden).map(([key, val]) => val && <input key={key} type="hidden" name={key} value={val} />)}
            <label htmlFor="table-search" className="sr-only">Search</label>
            <div className="relative w-full">
                <SearchIcon />
                {input}
            </div>
        </form>
    );
}

export function ToolbarDropdown({ label, icon, title, children }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const close = useCallback(() => setOpen(false), []);
    useClickOutside(ref, close, open);

    return (
        <div ref={ref} className="relative w-full md:w-auto">
            <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className={toolbarButtonClass}>
                {icon}
                {label}
                <svg className="-mr-1 ml-1.5 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path clipRule="evenodd" fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
            </button>
            {open && (
                <div className="absolute right-0 z-10 mt-2 w-48 p-3 bg-white rounded-lg shadow-sm dark:bg-gray-700" onClick={(e) => e.target.closest('a') && close()}>
                    <h6 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">{title}</h6>
                    <ul className="space-y-2 text-sm">{children}</ul>
                </div>
            )}
        </div>
    );
}

export const FilterIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-4 w-4 mr-2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
    </svg>
);

export const PlusIcon = (
    <svg className="h-3.5 w-3.5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path clipRule="evenodd" fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
    </svg>
);

export const radioClass = 'w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600';
export const checkboxClass = 'w-4 h-4 bg-gray-100 border-gray-300 rounded-sm text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500';
export const optionLabelClass = 'ml-2 text-sm font-medium text-gray-900 dark:text-gray-100';
