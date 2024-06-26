import {useState} from 'react'
import { router } from '@inertiajs/react'

export default function TableNavigation({max, page, currentPage, previous, next, links}) {

    return (
        <nav className="flex md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 pb-4"aria-label="Table navigation">
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400 p-6 my-auto">
                Showing
                <span className="font-semibold text-gray-900 dark:text-white"> {(currentPage-1)*10+1} - {(currentPage*10)  < max ? (currentPage*10)  : max} </span>
                of
                <span className="font-semibold text-gray-900 dark:text-white"> {max}</span>
            </span>
            <ul className="inline-flex items-stretch -space-x-px mr-2">
                <li>
                    <a href="#" onClick={() => router.visit(previous, {only:['tasks']})} className="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                        <span className="sr-only">Previous</span>
                        <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </a>
                </li>
                {
                    links.map((x) => x.label.length < 4 &&
                        <li key={x.label}>
                            <a key={x.label} href="#" onClick={() => router.visit(x.url, {only:['tasks']})} className={"flex items-center justify-center text-sm py-2 px-3 leading-tight border border-gray-300 hover:bg-gray-100 hover:text-gray-700  dark:hover:bg-gray-700 dark:hover:text-white" + (x.active ? "text-primary-600 bg-primary-50 border-gray-700 dark:bg-gray-700 dark:text-white" : "text-gray-500 bg-white dark:border-gray-700 dark:text-gray-400 dark:bg-gray-800")}>{x.label}</a>
                        </li>
                )}

                <li>
                    <a href="#" onClick={() => router.visit(next, {only:['tasks']})} className="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                        <span className="sr-only">Next</span>
                        <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                    </a>
                </li>
            </ul>
        </nav>)
}