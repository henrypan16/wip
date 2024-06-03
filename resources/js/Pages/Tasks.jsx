
import { useState, useEffect } from 'react'
import { Head, router} from '@inertiajs/react';
import Table from '../Components/TableSSR/Table'

export default function Tasks({tasks}) {
    console.log(tasks)
    const data = tasks.data.map((task) => {
        return {
        'id': task.id,
        'customer#': task.customer_id,
        'pharmacy': task.customer_name,
        'so# ': task.service_order,
        'problem': task.problem,
        'note': task.note,
        'loaner': task.loaner,
    }})
    const config = {
        'search': {
            'enable': true,
            'placeholder': '',
            'searchColumn': ['customer']
        },
        'button': {'enable': true, 'value': [{'name':'New Task', 'action': () => router.get('/task/create')}]},
        'checkbox': {'enable':false},
        'comboDropbox': {'enable': true},
        'optionDropbox': {'enable': true},
        'width' : ['0', '24', '64', '24', '48', '48']
    }

    useEffect(() => {
        // setData(data.map((task) => {
        //     task['Customer ID'] = ('000' + task['Customer ID']).slice(-4);
        // }))
        // console.log(data)
    }, [])
    

    return (
        <section className="bg-gray-50 dark:bg-gray-900 mr-4 sm:p-5 w-full  2xl:w-3/4 2xl:ml-32">
            
            <Head title="All Tasks"/>
            <div className="mx-auto px-4 lg:px-12 flex flex-wrap">
                {/* <!-- Start coding here --> */}
                {/*
                    Table(data, config)
                    data = Array
                    config = {
                        search: Bool - Enable search button
                        button: Int - Number of button
                        buttonValue: Array(String) - Description of each button
                        checkbox: {enable:bool, value:array(string), event:function()}
                        dropbox: {enable:bool, value:array(string), event:function()}
                    } 
                */}
                <h1 className="text-3xl text-gray-900 dark:text-white mb-6 basis-1/3">View All Task</h1>
                <div class="inline-flex rounded-md shadow-sm hidden">
                    <a href="/report/ready" target="_blank"  aria-current="page" class="px-4 py-2 text-sm font-medium text-blue-700 bg-white border border-gray-200 rounded-s-lg hover:bg-gray-100 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white">
                        Ready
                    </a>
                    <a href="/report/action" target="_blank"  class="px-4 py-2 text-sm font-medium text-gray-900 bg-white border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white">
                        Action
                    </a>
                    <a href="/report/repair" target="_blank" class="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-e-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white">
                        Repair
                    </a>
                </div>
                <Table data={data} ssr={tasks} config={config}/>
            </div>
        </section>
    )
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