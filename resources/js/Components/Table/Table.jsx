import {useState, useEffect} from 'react'
import TableToolbar from './TableToolbar'
import TableData from './TableData'
import TableNavigation from './TableNavigation'
//Array.from(Array(Math.ceil(data.length/10)).keys())
export default function Table({data, config}) {
    const max = Array.from(Array(Math.ceil(data.length/10)).keys())
    const [pageData, setPageData] = useState([]);
    const [currentData, setCurrentData] = useState([...data])
    const [currentPage, setCurrentPage] = useState(0);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(max.splice(5));

    useEffect(() => {
        setPageData(currentData.slice(currentPage * 10, currentPage * 10 + 10))
    }, [currentPage])
    
    useEffect(() => {
        if(search.length > 0)
        {
            setCurrentPage(0);
            setCurrentData(data.filter(row => {
                if(search === '') {
                    return row;
                } else if(row['name'].toLowerCase().includes(search.toLowerCase())) {
                    return row;
                }
            }))
        } else {
            setCurrentData([...data])
        }
    }, [search])

    useEffect(() => {
        setPage(Array.from(Array(Math.ceil(currentData.length/10)).keys()))
    }, [currentData])


    return (
        <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
            <TableToolbar config={config} search={search} setSearch={setSearch}/>
            <TableData data={pageData} width={config.width}/>
            <TableNavigation max={currentData.length} page={page} currentPage={currentPage} setCurrentPage={setCurrentPage}/>
        </div>)
}