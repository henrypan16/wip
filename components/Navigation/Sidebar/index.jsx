import SidebarDarkModeButton from './SidebarDarkModeButton';
import SidebarMenu from './SidebarMenu';
import SidebarSearch from './SidebarSearch';

export default function Sidebar({ open, close, handleChangeTheme, darkMode }) {
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
