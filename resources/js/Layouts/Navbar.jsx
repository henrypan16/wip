import { Application, Notification, Profile, Search, ToggleSidebar} from '@/Components/Navigation/Navbar'

export default function Navbar({}) {
    return (
        <nav className="bg-white border-b border-gray-200 px-4 py-2.5 dark:bg-gray-800 dark:border-gray-700 fixed left-0 right-0 top-0 sm:z-40 z-30">
            
            <div className="flex flex-wrap justify-between items-center md:items-left">
                <ToggleSidebar/>
                <div className="flex justify-start items-center">
                    <a href="/dashboard" className="flex items-center justify-between mr-4">
                        <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white ">Resource Department</span>
                        <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white hidden">RSS</span>
                    </a>
                    <Search/>
                </div>
                <Profile/>
            </div>
        </nav>);
  }