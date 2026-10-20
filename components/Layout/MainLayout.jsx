'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navigation/Navbar';
import Sidebar from '@/components/Navigation/Sidebar';
import Content from './Content';

export default function MainLayout({ user, children }) {
    const [darkMode, setDarkMode] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();

    // The theme class is applied by a script in the root layout before React loads.
    useEffect(() => setDarkMode(document.documentElement.classList.contains('dark')), []);

    // Close the mobile drawer after navigating.
    useEffect(() => setSidebarOpen(false), [pathname]);

    function handleChangeTheme() {
        const next = !darkMode;
        document.documentElement.classList.toggle('dark', next);
        try {
            localStorage.setItem('local', next);
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
