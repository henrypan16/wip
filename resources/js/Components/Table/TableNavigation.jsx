import {useState} from 'react'

export default function TableNavigation({max, page, currentPage, setCurrentPage}) {


    return (                    <nav className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4" aria-label="Table navigation">
    <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
        Showing
        <span className="font-semibold text-gray-900 dark:text-white"> {currentPage * 10 + 1} - {(currentPage + 1) * 10 < max ? (currentPage + 1)* 10 : max} </span>
        of
        <span className="font-semibold text-gray-900 dark:text-white"> {max}</span>
    </span>
    <ul className="inline-flex items-stretch -space-x-px">
        <li>
            <a href="#" onClick={() => {if(currentPage != 0) setCurrentPage(currentPage - 1)}} className="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                <span className="sr-only">Previous</span>
                <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
            </a>
        </li>
            {
                page.map((x) => { x < 5 &&
                <li key={x}>
                    <a key={x} href="#" onClick={() => setCurrentPage(x)} className={"flex items-center justify-center text-sm py-2 px-3 leading-tight border border-gray-300 hover:bg-gray-100 hover:text-gray-700  dark:hover:bg-gray-700 dark:hover:text-white" + (x == currentPage ? "text-primary-600 bg-primary-50 border-gray-700 dark:bg-gray-700 dark:text-white" : "text-gray-500 bg-white dark:border-gray-700 dark:text-gray-400 dark:bg-gray-800")}>{x+1}</a>
                </li>}
            )}

        <li>
            <a href="#" onClick={() => {if(currentPage != page.length - 1) setCurrentPage(currentPage + 1)}} className="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                <span className="sr-only">Next</span>
                <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
            </a>
        </li>
    </ul>
</nav>)
}