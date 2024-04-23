import React, {useState, useEffect} from 'react'
import TableToolbar from './TableToolbar'
import TableData from './TableData'
import TableNavigation from './TableNavigation'

export default function Table({data, config}) {
    const [currentData, setCurrentData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const page = Array.from(Array(Math.ceil(data.length/10)).keys());

    useEffect(() => {
        setCurrentData(data.slice(currentPage * 10, currentPage * 10 + 10))
    }, [currentPage])
    

    return (
        <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
            <TableToolbar config={config}/>
            <TableData data={currentData} width={config.width}/>
            <TableNavigation max={data.length} page={page} currentPage={currentPage} setCurrentPage={setCurrentPage}/>
        </div>)
}