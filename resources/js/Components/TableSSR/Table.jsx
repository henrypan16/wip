import {useState, useEffect} from 'react'
import TableToolbar from './TableToolbar'
import TableData from './TableData'
import TableNavigation from './TableNavigation'
//Array.from(Array(Math.ceil(data.length/10)).keys())
export default function Table({data, config, ssr}) {
    const [search, setSearch] = useState('');

    useEffect(() => {
        if(search.length > 0)
        {
           
        } else {
            
        }
    }, [search])

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md sm:rounded-lg">
            <TableToolbar config={config} search={search} setSearch={setSearch}/>
            <TableData data={data} width={config.width}/>
            <TableNavigation max={ssr.total} previous={ssr.prev_page_url} next={ssr.next_page_url} links={ssr.links} currentPage={ssr.current_page}/>
        </div>)
}


/*
{
    "current_page": 1,
    "data": [
        {
            ...
    ],
    "first_page_url": "http://127.0.0.1:8000/task?page=1",
    "from": 1,
    "last_page": 190,
    "last_page_url": "http://127.0.0.1:8000/task?page=190",
    "links": [
        {
            "url": null,
            "label": "&laquo; Previous",
            "active": false
        },
        {
            "url": "http://127.0.0.1:8000/task?page=1",
            "label": "1",
            "active": true
        },
        {
            "url": "http://127.0.0.1:8000/task?page=2",
            "label": "2",
            "active": false
        },
        {
            "url": "http://127.0.0.1:8000/task?page=3",
            "label": "3",
            "active": false
        },
        {
            "url": "http://127.0.0.1:8000/task?page=4",
            "label": "4",
            "active": false
        },
        {
            "url": "http://127.0.0.1:8000/task?page=5",
            "label": "5",
            "active": false
        },
        {
            "url": "http://127.0.0.1:8000/task?page=6",
            "label": "6",
            "active": false
        },
        {
            "url": "http://127.0.0.1:8000/task?page=7",
            "label": "7",
            "active": false
        },
        {
            "url": "http://127.0.0.1:8000/task?page=8",
            "label": "8",
            "active": false
        },
        {
            "url": "http://127.0.0.1:8000/task?page=9",
            "label": "9",
            "active": false
        },
        {
            "url": "http://127.0.0.1:8000/task?page=10",
            "label": "10",
            "active": false
        },
        {
            "url": null,
            "label": "...",
            "active": false
        },
        {
            "url": "http://127.0.0.1:8000/task?page=189",
            "label": "189",
            "active": false
        },
        {
            "url": "http://127.0.0.1:8000/task?page=190",
            "label": "190",
            "active": false
        },
        {
            "url": "http://127.0.0.1:8000/task?page=2",
            "label": "Next &raquo;",
            "active": false
        }
    ],
    "next_page_url": "http://127.0.0.1:8000/task?page=2",
    "path": "http://127.0.0.1:8000/task",
    "per_page": 10,
    "prev_page_url": null,
    "to": 10,
    "total": 1895
}
*/