'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { logout } from '@/actions/auth';
import SearchIcon from '@/components/SearchIcon';
import useClickOutside from '@/components/useClickOutside';

// The signed-in app shell: top navbar, sidebar drawer and the content area.

type User = { name: string; email: string };

type ThemeProps = { handleChangeTheme: () => void; darkMode: boolean };

export default function MainLayout({ user, children }: { user: User; children: ReactNode }) {
    const [darkMode, setDarkMode] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();

    // The theme class is applied by an inline script in the root layout before React loads.
    useEffect(() => setDarkMode(document.documentElement.classList.contains('dark')), []);

    // Close the mobile drawer after navigating.
    useEffect(() => setSidebarOpen(false), [pathname]);

    function handleChangeTheme() {
        const next = !darkMode;
        document.documentElement.classList.toggle('dark', next);
        try {
            localStorage.setItem('local', String(next));
        } catch {}
        setDarkMode(next);
    }

    return (
        <div className="antialiased bg-gray-50 dark:bg-gray-900 h-screen w-screen">
            <Navbar user={user} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
            <Sidebar open={sidebarOpen} close={() => setSidebarOpen(false)} handleChangeTheme={handleChangeTheme} darkMode={darkMode} />
            <Content>{children}</Content>
        </div>
    );
}

function Content({ children }: { children: ReactNode }) {
    return (
        <main className="fixed top-16 bottom-0 left-0 right-0 md:left-64 overflow-auto">
            {children}
        </main>
    );
}

function Navbar({ user, toggleSidebar, sidebarOpen }: { user: User; toggleSidebar: () => void; sidebarOpen: boolean }) {
    return (
        <nav className="bg-white border-b border-gray-200 px-4 py-2.5 dark:bg-gray-800 dark:border-gray-700 fixed left-0 right-0 top-0 sm:z-40 z-30">
            <div className="flex flex-wrap justify-between items-center md:items-left">
                <ToggleSidebar onClick={toggleSidebar} open={sidebarOpen} />
                <div className="flex justify-start items-center">
                    <Link href="/dashboard" className="flex items-center justify-between mr-4">
                        <span className="self-center text-lg sm:text-2xl font-semibold whitespace-nowrap dark:text-white">Resource Department</span>
                    </Link>
                    <Search />
                </div>
                <Profile user={user} />
            </div>
        </nav>
    );
}

function ToggleSidebar({ onClick, open }: { onClick: () => void; open: boolean }) {
    return (
        <button onClick={onClick} aria-controls="drawer-navigation" aria-expanded={open} className="p-2 mr-2 text-gray-600 rounded-lg cursor-pointer md:hidden hover:text-gray-900 hover:bg-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700 focus:ring-2 focus:ring-gray-100 dark:focus:ring-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
            {open ? (
                <svg aria-hidden="true" className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                </svg>
            ) : (
                <svg aria-hidden="true" className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path>
                </svg>
            )}
            <span className="sr-only">Toggle sidebar</span>
        </button>
    );
}

// Searches all tasks.
function Search() {
    return (
        <form action="/task" method="GET" className="hidden md:block md:pl-2">
            <label htmlFor="topbar-search" className="sr-only">Search</label>
            <div className="relative md:w-64 lg:w-96">
                <SearchIcon />
                <input type="text" name="search" id="topbar-search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Search" />
            </div>
        </form>
    );
}

function Profile({ user }: { user: User }) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const close = useCallback(() => setOpen(false), []);
    useClickOutside(ref, close, open);

    // First and last initials, so the badge fits.
    const names = user.name.trim().split(/\s+/);
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
                        <span className="block text-sm font-semibold text-gray-900 dark:text-white">{user.name}</span>
                        <span className="block text-sm text-gray-900 truncate dark:text-white">{user.email}</span>
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

function Sidebar({ open, close, handleChangeTheme, darkMode }: { open: boolean; close: () => void } & ThemeProps) {
    return (
        <>
            {open && <div className="bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-30 md:hidden" onClick={close} />}
            <aside id="drawer-navigation" aria-label="Sidenav"
                className={`fixed top-0 left-0 sm:z-30 z-40 w-64 h-screen pt-14 transition-transform bg-white border-r border-gray-200 md:translate-x-0 dark:bg-gray-800 dark:border-gray-700 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="overflow-y-auto py-5 px-3 h-full bg-white dark:bg-gray-800">
                    <SidebarSearch />
                    <SidebarMenu />
                </div>
                <SidebarDarkModeButton handleChangeTheme={handleChangeTheme} darkMode={darkMode} />
            </aside>
        </>
    );
}

// Shown in the drawer on small screens, where the navbar search is hidden.
function SidebarSearch() {
    return (
        <form action="/task" method="GET" className="md:hidden mb-2">
            <label htmlFor="sidebar-search" className="sr-only">Search</label>
            <div className="relative">
                <SearchIcon />
                <input type="text" name="search" id="sidebar-search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Search" />
            </div>
        </form>
    );
}

function SidebarMenu() {
    return (
        <ul className="space-y-2">
            <SidebarMenuItem url="/dashboard" name="Dashboard" icon="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
            <SidebarMenuItem url="/task" name="Tasks" icon="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" />
            <SidebarMenuItem url="/loaner" name="Loaners" icon="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" />
            <SidebarMenuItem url="#" name="Keys" icon="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" />
        </ul>
    );
}

function SidebarMenuItem({ url, name, icon }: { url: string; name: string; icon: string }) {
    return (
        <li>
            <Link href={url} className="flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                <svg aria-hidden="true" className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd">
                    <path d={icon}></path>
                </svg>
                <span className="ml-3">{name}</span>
            </Link>
        </li>
    );
}

function SidebarDarkModeButton({ handleChangeTheme, darkMode }: ThemeProps) {
    return (
        <div className="absolute sm:bottom-0 bottom-16 left-0 justify-center p-4 space-x-4 w-full flex bg-white dark:bg-gray-800 z-20">
            <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" onChange={handleChangeTheme} className="sr-only peer" checked={darkMode} />
                <div className="w-14 h-7 bg-gray-200 peer-focus:outline-hidden peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Dark Mode</span>
            </label>
        </div>
    );
}
