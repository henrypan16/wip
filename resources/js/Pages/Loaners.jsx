
import { Head } from '@inertiajs/react';
import { useState, useEffect, useReducer } from 'react'
import Table from '../Components/Table/Table'

export default function Loaners({loaners}) {
    const [currentPage, setCurrentPage] = useState(0);

    const config = {
        'search': {'enable': true},
        'button': 0,
        'checkbox': {'enable': false},
        'comboDropbox': {'enable': true},
        'optionDropbox': {'enable': true},
        'width' : ['0', '0', '0', '0']
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
            'status': statusDict.get(loaner.status)
        }
    });

    const page = Array.from(Array(Math.ceil(loaners.length/10)).keys());
    
    return (
        <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5 pt-10 ">
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
  