import React from 'react'
import { useState, useEffect } from 'react'
import { Head, router} from '@inertiajs/react';
import Table from '../Components/Table/Table'

export default function Tasks({tasks}) {
    const data = tasks.map((task) => {
        return {
        'id': task.id,
        'Customer#': task.customer_id,
        'Pharmacy': task.customer_name,
        'SO#': task.service_order,
        'Problem': task.problem,
        'Note': task.note,
        'Loaner': task.loaner,
    }})
    const redirect = () => router.get('task/create')
    const config = {
        'search': true,
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
        <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
            <Head title="All Tasks"/>
            <div className="mx-auto max-w-screen-xl px-4 lg:px-12">
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
                <Table data={data} config={config}/>
            </div>
        </section>
    )
}