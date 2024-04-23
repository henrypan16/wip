import React from 'react'
import { Head } from '@inertiajs/react';
import { useState, useEffect, useReducer } from 'react'
import Table from '../Components/Table/Table'

export default function Loaners({loaners}) {
    const [currentPage, setCurrentPage] = useState(0);
    const [, forceUpdate] = useReducer(x => x + 1, 0);
    const config = {
        'search': true,
        'button': 0,
        'checkbox': {'enable': false},
        'comboDropbox': {'enable': true},
        'optionDropbox': {'enable': true},
        'width' : ['0', '64', '64', '32']
    }
    let statusDict = new Map([
        ['0', 'Available'],
        ['-1', 'Discontinued']
    ])   
     
    const data = loaners.map((loaner) => {
        return {
            'id': loaner.id,
            'name': loaner.name,
            'category': loaner.category,
            'status': statusDict[loaner.Status]
        }
    });

    const page = Array.from(Array(Math.ceil(loaners.length/10)).keys());
    
    return (
        <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
            <Head title="All Loaners"/>
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
  