import React from 'react'
import { useState, useEffect } from 'react'
import Table from '../Components/Table/Table'

export default function Loaners({loaners}) {
    const [allLoaners, setAllLoaners] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const config = {
        'search': true,
        'button': 0,
        'checkbox': {'enable':false},
        'comboDropbox': {'enable': true},
        'optionDropbox': {'enable': true}
    }

    const page = Array.from(Array(Math.ceil(loaners.length/10)).keys());

    let statusDict = new Map([
        ['0', 'Available'],
        ['-1', 'Discontinued']
    ])    

    return (
        <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
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
                <Table data={loaners} config={config}/>
            </div>
        </section>
    )
}
  