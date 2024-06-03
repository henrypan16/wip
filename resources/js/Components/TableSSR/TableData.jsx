import {useState, useEffect, useRef} from 'react'
import { router } from '@inertiajs/react';
import DropdownButton from './DropdownButton'

export default function TableData({data, width}) {
    let statusDict = new Map([
        ['0', 'Available'],
        ['-1', 'Discontinued']
    ]) 

    return (
        <table className="text-sm text-left text-gray-500 dark:text-gray-400 table-fixed w-full">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400  overflow-hidden">
                <tr className="">
                    {data[0] != null && Object.keys(data[0]).map((x, i) => 
                        i > 0 && <th key={'col-'+ i + '-header'} scope="col" className={`w-${width[i]} px-4 py-3 truncate`}>{x}</th>
                    )}

                </tr>
            </thead>
            <tbody>
                {[...Array(10)].map((e,i) => {if(i < data.length)
                    // For 10 rows per page, if row does not belong to the page, it will be hidden
                    return (
                        <tr key={'row'+i} className="w-full border-b dark:border-gray-700 hover:bg-gray-500 hover:cursor-pointer" onClick={() => router.get(`/task/${data[i].id}/edit`)}>
                            {Object.values(data[i]).map((info, j) => j > 0 && <td key={'row-'+i+'-col-'+j} className="px-4 py-3 truncate">{info}</td>)}
                        </tr>
                        )
                    })}
            </tbody>
        </table>
    )
}
/*                    <th scope="col" className="x-4 py-3 w-24 truncate">
                        <span className="sr-only">Actions</span>
                    </th>*/
/*
                    /* <th scope="row" className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">{data[i].name}</th>
                    <td className="px-4 py-3">{data[i].category}</td>
            <td className="px-4 py-3">{data[i].status <= 0 ? statusDict.get(data[i].status):  data[i].status}</td>*/
                    /* <td key={'row-'+i+'actions'} className="px-4 py-3 truncate flex items-center justify-end">
                        <DropdownButton id={data[i].id}/>
                    </td> */
