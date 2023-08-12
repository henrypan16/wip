import React from 'react'
import { Link, Head } from '@inertiajs/react';
import { useState } from 'react';
import { router } from '@inertiajs/react'
import { useForm } from '@inertiajs/react'
import LoanerSelection from './LoanerSelection'
import LoanerRemoval from './LoanerRemoval'
import { initFlowbite } from 'flowbite'

export default function CreateTask({allLoaners, customers}) {
    const [all, setAll] = useState(allLoaners);
    const [id, setId] = useState('');
    const [pharmacy, setPharmacy] = useState('');
    const [loaners, setLoaners] = useState([]);
    const [date, setDate] = useState(dateConverter(new Date()))
    const { data, setData, post, processing, errors } = useForm({
        
    })

    function handleChange(e) {
        let newId = e.target.value;
        if(newId < 1) {
            setId('');
            setPharmacy('');
        } else if(newId > customers.length) {
            setId(customers.length)
            setPharmacy(customers[customers.length-1].name);
        } else {
            setId(newId);
            setPharmacy(customers[newId-1].name);
        }
        return;
    }

    function handleDateChange(e) {
        let date = new Date(e.target.value);
        setDate(dateConverter(date));
    }

    function dateConverter(date) {
        return date.toISOString().split('T')[0]
    }

    function addLoaner(selectedLoaner) {
        console.log(selectedLoaner);
        setAll(all.filter(loaner => loaner.id != selectedLoaner.id));
        setLoaners([...loaners, selectedLoaner]);
    }

    function removeLoaner(selectedLoaner) {
        console.log(selectedLoaner);
        const sorted = [...all, selectedLoaner];
        sorted.sort((a, b) => a.id < b.id ? -1 : 1);
        setAll(sorted);
        setLoaners(loaners.filter(loaner => loaner.id != selectedLoaner.id));
    }

  return (
    <div id="defaultModal" tabIndex="-1" aria-hidden="true" className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-modal md:h-full">
        <div className="relative p-4 w-full max-w-3xl h-full md:h-auto">
            {/* <!-- Modal content --> */}
            <div className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                {/* <!-- Modal header --> */}
                <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Add New Task
                    </h3>
                    <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="defaultModal">
                        <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                        <span className="sr-only">Close modal</span>
                    </button>
                </div>
                {/* <!-- Modal body --> */}
                <form action="#">
                    <div className="grid gap-4 mb-4 sm:grid-cols-18">
                        <div className="sm:col-span-4">
                            <label htmlFor="id" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Customer</label>
                            <input value={id} onChange={handleChange} type="number" name="id" id="id" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Customer ID" required=""/>
                        </div>
                        <div className="sm:col-span-14">
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Pharmacy's Name</label>
                            <input value={pharmacy} disabled type="text" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Pharmacy's name" required=""/>
                        </div>
                        <div className="sm:col-span-6">
                            <label htmlFor="tag" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tag #</label>
                            <input type="number" name="tag" id="tag" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Tag ID" required=""/>
                        </div>
                        <div className="sm:col-span-6">
                            <label htmlFor="order" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Service Order</label>
                            <input type="number" name="order" id="order" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Service Order" required=""/>
                        </div>
                        <div className="sm:col-span-6">
                            <label htmlFor="date" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Date</label>
                            <input type="date" name="date" id="date" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" required=""/>
                        </div>
                        <div className="sm:col-span-full">
                            <label htmlFor="equipment" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Equipment</label>
                            <input type="text" name="equipment" id="equipment" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" required=""/>
                        </div>
                        <div className="sm:col-span-full">
                            <label htmlFor="problem" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Problem</label>
                            <input type="text" name="problem" id="problem" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" required=""/>
                        </div>
                        <div className="sm:col-span-full">
                            <label htmlFor="note" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Note</label>
                            <textarea name="note" rows="3" id="note" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" required=""/>
                        </div>
                        
                        <LoanerSelection addLoaner={addLoaner} allLoaners={all}/>
                        <div className="flex col-span-full">
                                {loaners.map((loaner) =>
                                    <div key={loaner.id} className="flex justify-center items-center p-2 rounded-lg border border-sky-500 mr-3" controlid="Loaner">
                                        <div className="mr-2">{loaner.device} #{loaner.name}</div>
                                        <button type="button" onClick={() => removeLoaner(loaner)} className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-1 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">-</button>
                                    </div>)}
                        </div>
                    </div>
                    <button type="submit" className="inline-flex focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                        <svg className="mr-1 -ml-1 w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path></svg>
                        Add new task
                    </button>
                </form>
            </div>
        </div>
    </div>
  )
}
