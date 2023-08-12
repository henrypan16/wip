import React from 'react'
import { Link, Head } from '@inertiajs/react';
import { useState } from 'react';
import { router } from '@inertiajs/react'
import { useForm } from '@inertiajs/react'
import LoanerSelection from './LoanerSelection'
import LoanerRemoval from './LoanerRemoval'
import { initFlowbite } from 'flowbite'

export default function CreateTask() {
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
        allLoaners = allLoaners.filter(loaner => loaner.id != selectedLoaner.id);
        console.log(allLoaners);
        setLoaners([...loaners, selectedLoaner]);
    }

    function removeLoaner(selectedLoaner) {
        allLoaners.push(selectedLoaner)
        setLoaners(loaners.filter(loaner => loaner.id != selectedLoaner.id))
    }

  return (
    <div id="defaultModal" tabindex="-1" aria-hidden="true" className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-modal md:h-full">
        <div className="relative p-4 w-full max-w-2xl h-full md:h-auto">
            {/* <!-- Modal content --> */}
            <div className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                {/* <!-- Modal header --> */}
                <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Add Product
                    </h3>
                    <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="defaultModal">
                        <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                        <span className="sr-only">Close modal</span>
                    </button>
                </div>
                {/* <!-- Modal body --> */}
                <form action="#">
                    <div className="grid gap-4 mb-4 sm:grid-cols-2">
                        <div>
                            <label for="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Customer</label>
                            <input type="number" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Customer ID" required=""/>
                        </div>
                        <div>
                            <label for="brand" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Pharmacy's Name</label>
                            <input type="text" name="brand" id="brand" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Pharmacy's name" required=""/>
                        </div>
                        <div>
                            <label for="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Price</label>
                            <input type="number" name="price" id="price" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="$2999" required=""/>
                        </div>
                        <div>
                            <label for="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category</label>
                            <select id="category" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                                <option selected="">Select category</option>
                                <option value="TV">TV/Monitors</option>
                                <option value="PC">PC</option>
                                <option value="GA">Gaming/Console</option>
                                <option value="PH">Phones</option>
                            </select>
                        </div>
                        <div className="sm:col-span-2">
                            <label for="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                            <textarea id="description" rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Write product description here"></textarea>                    
                        </div>
                    </div>
                    <button type="submit" className="text-gray-900 inline-flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                        <svg className="mr-1 -ml-1 w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"></path></svg>
                        Add new product
                    </button>
                </form>
            </div>
        </div>
    </div>
  )
}
