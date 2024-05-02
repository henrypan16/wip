import TableData from '../Components/Table/TableData'
import { Head } from '@inertiajs/react'


export default function Report({tasks}) {
    return (
        <PrintLayout>
            <Head title="Report"/>
            <h1 className="m-4 text-xl">Current WIP Action</h1>
            <table className="text-sm text-left text-gray-500 dark:text-gray-400 table-fixed w-full">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th key='1' scope="col" className='px-1 py-3 w-8'>ID</th>
                        <th key='2' scope="col" className='px-1 py-3 w-52'>Pharmacy Name</th>
                        <th key='3' scope="col" className='px-1 py-3 w-12'>SO#</th>
                        <th key='4' scope="col" className='px-1 py-3 w-48'>Problem</th>
                        <th key='5' scope="col" className='px-1 py-3 w-48'>Note</th>
                        <th key='6' scope="col" className='px-1 py-3 w-24'>Loaner</th>
                    </tr>
                </thead>
                <tbody>
                        {
                            tasks.map((task) =>                           
                                <tr className="border-b dark:border-gray-700">
                                    {Object.values(task).map((info, j) => j > 0 && <td className="py-1 truncate">{info}</td>)}
                                </tr>
                            )
                        }                    
                </tbody>
            </table>
        </PrintLayout>
    )
}

Report.layout = page => <PrintLayout children={page}/>

function PrintLayout({children}) {
    return (
        <main>
            {children}
        </main>
    )
}