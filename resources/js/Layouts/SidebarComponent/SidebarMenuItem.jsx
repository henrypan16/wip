export default function SidebarMenuItem({name, icon}) {
    return (
    <li>
        <a href="/dashboard" className="flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
            <svg aria-hidden="true" className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd">
                <path d={icon}></path>
            </svg>
            <span className="ml-3">{name}</span>
        </a>
    </li>
    );
}