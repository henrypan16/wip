import SearchIcon from '../SearchIcon';

// Shown in the drawer on small screens, where the navbar search is hidden.
export default function SidebarSearch() {
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
