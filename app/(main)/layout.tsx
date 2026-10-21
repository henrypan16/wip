import Link from 'next/link';
import type { ReactNode } from 'react';
import { requireUser } from '@/lib/session';
import { DarkModeToggle, DrawerAutoClose, ProfileMenu, TaskSearch } from './LayoutControls';

// The signed-in app shell: top navbar, sidebar and the content area.
//
// On small screens the sidebar is a drawer opened by the hidden #drawer-toggle
// checkbox: the menu button and the backdrop are labels for it, and CSS slides
// the drawer in while it is checked.

// Every page reads live data from the Access database.
export const dynamic = 'force-dynamic';

const MENU = [
    { url: '/dashboard', name: 'Dashboard', icon: 'M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z' },
    { url: '/task', name: 'Tasks', icon: 'M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z' },
    { url: '/loaner', name: 'Loaners', icon: 'M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z' },
];

export default async function Layout({ children }: { children: ReactNode }) {
    const user = await requireUser();

    return (
        <div className="group/shell antialiased bg-gray-50 dark:bg-gray-900 h-screen w-screen">
            <input type="checkbox" id="drawer-toggle" className="peer sr-only" aria-controls="drawer-navigation" aria-label="Toggle sidebar" />
            <DrawerAutoClose />

            <nav className="bg-white border-b border-gray-200 px-4 py-2.5 dark:bg-gray-800 dark:border-gray-700 fixed left-0 right-0 top-0 sm:z-40 z-30">
                <div className="flex flex-wrap justify-between items-center md:items-left">
                    <label htmlFor="drawer-toggle" aria-hidden="true"
                        className="p-2 mr-2 text-gray-600 rounded-lg cursor-pointer md:hidden hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white group-has-[#drawer-toggle:focus-visible]/shell:ring-2 group-has-[#drawer-toggle:focus-visible]/shell:ring-gray-300">
                        <svg className="w-6 h-6 group-has-[#drawer-toggle:checked]/shell:hidden" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path>
                        </svg>
                        <svg className="w-6 h-6 hidden group-has-[#drawer-toggle:checked]/shell:block" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                        </svg>
                    </label>
                    <div className="flex justify-start items-center">
                        <Link href="/dashboard" className="flex items-center justify-between mr-4">
                            <span className="self-center text-lg sm:text-2xl font-semibold whitespace-nowrap dark:text-white">Resource Department</span>
                        </Link>
                        {/* Searches all tasks. */}
                        <TaskSearch id="topbar-search" className="hidden md:flex items-center md:pl-2 md:w-64 lg:w-96" />
                    </div>
                    <ProfileMenu name={user.name} email={user.email} />
                </div>
            </nav>

            {/* Clicking outside the open drawer closes it. */}
            <label htmlFor="drawer-toggle" aria-hidden="true" className="hidden peer-checked:block md:peer-checked:hidden bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-30" />

            <aside id="drawer-navigation" aria-label="Sidenav"
                className="fixed top-0 left-0 sm:z-30 z-40 w-64 h-screen pt-14 transition-transform bg-white border-r border-gray-200 -translate-x-full peer-checked:translate-x-0 md:translate-x-0 dark:bg-gray-800 dark:border-gray-700">
                <div className="overflow-y-auto py-5 px-3 h-full bg-white dark:bg-gray-800">
                    {/* Shown in the drawer on small screens, where the navbar search is hidden. */}
                    <TaskSearch id="sidebar-search" className="md:hidden mb-2" />
                    <ul className="space-y-2">
                        {MENU.map((item) => (
                            <li key={item.url}>
                                <Link href={item.url} className="flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                    <svg aria-hidden="true" className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd">
                                        <path d={item.icon}></path>
                                    </svg>
                                    <span className="ml-3">{item.name}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="absolute sm:bottom-0 bottom-16 left-0 justify-center p-4 space-x-4 w-full flex bg-white dark:bg-gray-800 z-20">
                    <DarkModeToggle />
                </div>
            </aside>

            <main className="fixed top-16 bottom-0 left-0 right-0 md:left-64 overflow-auto">
                {children}
            </main>
        </div>
    );
}
