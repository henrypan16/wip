
import { useState, useEffect } from 'react'
import { Head, router} from '@inertiajs/react';
import Table from '../Components/Table/Table'

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
    const redirect = () => router.get('task/create')
    const config = {
        'search': {
            'enable': true,
            'placeholder': '',
            'searchColumn': ['customer']
        },
        'button': {'enable': true, 'value': [{'name':'New Task', 'action': redirect}]},
        'checkbox': {'enable':false},
        'comboDropbox': {'enable': true},
        'optionDropbox': {'enable': true},
        'width' : ['0', '24', '64', '24', '48', '48', '32', '12']
    }

    useEffect(() => {
        // setData(data.map((task) => {
        //     task['Customer ID'] = ('000' + task['Customer ID']).slice(-4);
        // }))
        // console.log(data)
    }, [])
    

    return (
        <section className="bg-gray-50 dark:bg-gray-900 mr-4 sm:p-5">
            
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
                <h1 className="text-3xl text-gray-900 dark:text-white mb-6 basis-2/3">View All Task</h1>
                <div class="inline-flex rounded-md shadow-sm">
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
                <Table data={data} config={config}/>
            </div>
        </section>
    )
}