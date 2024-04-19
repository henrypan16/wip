import React, {useState} from 'react'

export default function TableData({data}) {
    let statusDict = new Map([
        ['0', 'Available'],
        ['-1', 'Discontinued']
    ])  

    return (<div className="overflow-x-auto">
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                {data[0] != null && Object.keys(data[0]).map((x, i) => 
                    i > 0 && <th scope="col" className="px-4 py-3">{x}</th>
                )}
                <th scope="col" className="px-4 py-3">
                    <span className="sr-only">Actions</span>
                </th>
            </tr>
        </thead>
        <tbody>
            {[...Array(10)].map((e,i) => {if(i < data.length)
                // For 10 rows per page, if row does not belong to the page, it will be hidden
                return <tr key={i} className={"border-b dark:border-gray-700"}>
                    {Object.values(data[i]).map((info, i) => i > 0 && <td className="px-4 py-3">{info}</td>)}
                    {/* <th scope="row" className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">{data[i].name}</th>
                    <td className="px-4 py-3">{data[i].category}</td>
            <td className="px-4 py-3">{data[i].status <= 0 ? statusDict.get(data[i].status):  data[i].status}</td>*/}
                    <td className="px-4 py-3 flex items-center justify-end">
                        <button data-dropdown-toggle={data[i].id} className="inline-flex items-center p-0.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100" type="button">
                            <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                            </svg>
                        </button>
                        <div id={data[i].id} className="hidden z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600">
                            <ul className="py-1 text-sm text-gray-700 dark:text-gray-200" >
                                <li>
                                    <a href="#" className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Show</a>
                                </li>
                                <li>
                                    <a href="#" className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Edit</a>
                                </li>
                            </ul>
                            <div className="py-1">
                                <a href="#" className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Delete</a>
                            </div>
                        </div>
                    </td> 
                </tr>
                })}
        </tbody>
    </table>
</div>)
}