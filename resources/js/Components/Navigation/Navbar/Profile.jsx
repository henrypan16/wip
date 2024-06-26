
import { router, usePage } from '@inertiajs/react';
import { useRef, useEffect } from 'react'
import { Dropdown } from 'flowbite'

export default function Profile({}) {
    const {auth} = usePage().props;
    const user = auth.user;
    const inputElement = useRef('');

    useEffect(() => {
        const targetEl = document.getElementById('profile-dropdown');
        const triggerEl = document.getElementById('profile-button');
        const options = {
            placement: 'bottom',
            triggerType: 'click',
            offsetSkidding: 0,
            offsetDistance: 10,
            delay: 300,
            ignoreClickOutsideClass: false}

        const instanceOptions = {
                id: 'dropdownMenu',
                override: true
              };

        inputElement.current = new Dropdown(targetEl, triggerEl, options, instanceOptions)
        console.log(inputElement.current)
    }, [auth]);

  return (
    <div>
        {/* { auth.user == null ?
            <div className="w-24 h-8 rounded-full font-bold bg-gray-500 flex justify-center items-center hover:ring-4">
                <a onClick={() => router.get('register')} href="#" className="block text-center py-2 w-24 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 hover:rounded-full dark:hover:text-white">Register</a>
            </div>
                : */}
            <button type="button" className="flex mx-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600" id="profile-button" onClick={() => console.log(inputElement.current.isVisible())}aria-expanded="false">
                <span className="sr-only">Open user menu</span>
                <div className="w-8 h-8 rounded-full font-bold border-2 border-black bg-white dark:bg-black dark:border-white flex justify-center items-center" alt="user photo">
                    {auth.user != null && <h1 className="text-lg text-dark dark:text-white">{user.name.split(' ').map((n)=>n[0])}</h1>}
                </div>
            </button>
        
        {auth.user != null && 
        <div className="hidden z-50 my-4 w-56 text-base list-none bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600 rounded-xl" id="profile-dropdown">
            <div className="py-3 px-4">
            <span className="block text-sm font-semibold text-gray-900 dark:text-white">{user.name}</span>
            <span className="block text-sm text-gray-900 truncate dark:text-white">{user.email}</span>
            </div>

            <ul className="py-1 text-gray-700 dark:text-gray-300" aria-labelledby="dropdown">
            <li>
                {auth.user != null && <a onClick={() => router.post('logout')} href="#" className="block py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 hover:rounded-lg dark:hover:text-white">Sign out</a>}
            </li>
            </ul>
        </div>}
    </div>
  )
}


{/*
                                <ResponsiveNavLink method="post" href={route('logout')} as="button">
                                Log Out
                            </ResponsiveNavLink>
<a href="#" className="block py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Sign out</a>


                <ul className="py-1 text-gray-700 dark:text-gray-300" aria-labelledby="dropdown">
            <li>
                <a href="#" className="block py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-400 dark:hover:text-white">My profile</a>
            </li>
            <li>
                <a href="#" className="block py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-400 dark:hover:text-white">Account settings</a>
            </li>
            </ul>
            <ul className="py-1 text-gray-700 dark:text-gray-300" aria-labelledby="dropdown">
                <li>
                    <a href="#" className="flex items-center py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"><svg className="mr-2 w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path>
                    </svg>
                    My likes</a>
                </li>
                <li>
                    <a href="#" className="flex items-center py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"><svg className="mr-2 w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"></path>
                    </svg>
                    Collections</a>
                </li>
                <li>
                    <a href="#" className="flex justify-between items-center py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                    <span className="flex items-center">
                        <svg aria-hidden="true" className="mr-2 w-5 h-5 text-primary-600 dark:text-primary-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd"></path>
                        </svg>
                        Pro version
                    </span>
                    <svg aria-hidden="true" className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                    </svg>
                    </a>
                </li>
            </ul>

*/}