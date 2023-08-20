export default function SidebarDarkModeButton({handleChangeTheme, darkMode}) {
    return (<div className="absolute sm:bottom-0 bottom-16 left-0 justify-center p-4 space-x-4 w-full flex bg-white dark:bg-gray-800 z-20">
        <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" onClick={handleChangeTheme} className="sr-only peer" defaultChecked={darkMode} />
            <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Dark Mode</span>
        </label>
    </div>);
}