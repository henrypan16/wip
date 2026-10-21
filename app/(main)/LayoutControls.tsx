'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { logout } from '@/actions/auth';
import TableSearchBar from '@/components/Table/TableSearchBar';
import useClickOutside from '@/components/useClickOutside';
import useTaskSearch from '@/components/useTaskSearch';

// The interactive pieces of the app shell in layout.tsx, which is a server component.

/** Close the mobile drawer (the #drawer-toggle checkbox in layout.tsx) after navigating. */
export function DrawerAutoClose() {
    const pathname = usePathname();
    useEffect(() => {
        const toggle = document.getElementById('drawer-toggle') as HTMLInputElement | null;
        if (toggle) toggle.checked = false;
    }, [pathname]);
    return null;
}

/** Searches all tasks as you type, from the navbar or the drawer. */
export function TaskSearch({ id, className }: { id: string; className: string }) {
    const query = useTaskSearch();
    return <TableSearchBar id={id} className={className} value={query.value} onChange={query.setValue} onSubmit={query.submit} />;
}

export function ProfileMenu({ name, email }: { name: string; email: string }) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const close = useCallback(() => setOpen(false), []);
    useClickOutside(ref, close, open);

    // First and last initials, so the badge fits.
    const names = name.trim().split(/\s+/);
    const initials = (names[0][0] + (names.length > 1 ? names[names.length - 1][0] : '')).toUpperCase();

    return (
        <div ref={ref} className="relative">
            <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className="flex mx-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600">
                <span className="sr-only">Open user menu</span>
                <div className="w-8 h-8 rounded-full font-bold border-2 border-black bg-white dark:bg-black dark:border-white flex justify-center items-center">
                    <span className="text-lg text-gray-900 dark:text-white">{initials}</span>
                </div>
            </button>

            {open && (
                <div className="absolute right-0 z-50 my-4 w-56 text-base list-none bg-white divide-y divide-gray-100 shadow-sm dark:bg-gray-700 dark:divide-gray-600 rounded-xl">
                    <div className="py-3 px-4">
                        <span className="block text-sm font-semibold text-gray-900 dark:text-white">{name}</span>
                        <span className="block text-sm text-gray-900 truncate dark:text-white">{email}</span>
                    </div>
                    <ul className="py-1 text-gray-700 dark:text-gray-300">
                        <li>
                            <Link href="/profile" onClick={close} className="block py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 hover:rounded-lg dark:hover:text-white">Profile</Link>
                        </li>
                        <li>
                            <button type="button" onClick={() => logout()} className="block w-full text-left py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 hover:rounded-lg dark:hover:text-white">Sign out</button>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
}

export function DarkModeToggle() {
    const [darkMode, setDarkMode] = useState(false);

    // The theme class is applied by an inline script in the root layout before React loads.
    useEffect(() => setDarkMode(document.documentElement.classList.contains('dark')), []);

    function handleChangeTheme() {
        const next = !darkMode;
        document.documentElement.classList.toggle('dark', next);
        try {
            localStorage.setItem('local', String(next));
        } catch {}
        setDarkMode(next);
    }

    return (
        <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" onChange={handleChangeTheme} className="sr-only peer" checked={darkMode} />
            <div className="w-14 h-7 bg-gray-200 peer-focus:outline-hidden peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Dark Mode</span>
        </label>
    );
}
