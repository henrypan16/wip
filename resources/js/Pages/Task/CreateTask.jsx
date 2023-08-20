import React from 'react'
import { Link, Head } from '@inertiajs/react';
import { useState, useContext, useRef, useEffect} from 'react';
import { router } from '@inertiajs/react'
import { useForm } from '@inertiajs/react'
import LoanerSelection from './LoanerSelection'
import { initFlowbite } from 'flowbite'
import Datepicker from 'flowbite-datepicker/Datepicker';
import { format } from 'date-fns'

export default function CreateTask({allLoaners, customers}) {
    useEffect(() => {
        const datepickerEl = document.getElementById('datepickerId');
        new Datepicker(datepickerEl, {
            autohide: true,
            format: 'dd/mm/yyyy'
        }); 
    }, []);

    const [all, setAll] = useState(allLoaners);
    const [pharmacy, setPharmacy] = useState('');
    const [loaners, setLoaners] = useState([]);
    const { data, setData, post, processing, errors } = useForm({
        customer_id: '',
        user_id: 1,
        service_order: '',
        title: '',
        date: String(format(new Date(), 'dd/MM/yyyy')),
        equipment: '',
        problem: '',
        note: '',
        loaners: [],
        status_id: 1,
        type_id: 1
    })

    function handleChangeID(e) {
        let newId = e.target.value;
        if(newId < 1) {
            setData('customer_id', '');
            setPharmacy('');
        } else if(newId > customers.length) {
            setData('customer_id', customers.length)
            setPharmacy(customers[customers.length-1].name);
        } else {
            setData('customer_id', newId);
            setPharmacy(customers[newId-1].name);
        }
        return;
    }

    function handleChangeDate(e) {
        let date = new Date(e.target.value);
        setDate(date.toISOString().split('T')[0]);
    }

    function addLoaner(selectedLoaner) {
        console.log(selectedLoaner);
        setAll(all.filter(loaner => loaner.id != selectedLoaner.id));
        setData('loaners', [...data.loaners, selectedLoaner]);
    }

    function removeLoaner(selectedLoaner) {
        console.log(selectedLoaner);
        const sorted = [...all, selectedLoaner];
        sorted.sort((a, b) => a.id < b.id ? -1 : 1);
        setAll(sorted);
        setData('loaners', data.loaners.filter(loaner => loaner.id != selectedLoaner.id));
    }

    function submit(e) {
        e.preventDefault();
        post('/tasks');
    }

  return (
    <main className="dark:bg-gray-900 px-5 pb-80 sm:px-10 md:px-5 lg:pt-30 lg:px-32 xl:px-60 2xl:px-80 md:ml-64 h-auto pt-24">
        <Head title="New Task"></Head>
        
        <form onSubmit={submit}>
            <div className="grid gap-4 mb-4 sm:grid-cols-18">
                <div className="sm:col-span-8 mb-6 flex items-center">
                    <span className="text-3xl text-bold dark:text-white">Create New Task</span>
                </div>
                <div className="sm:col-span-10 relative z-0 w-full mb-6 group">
                    <input value={data.title} onChange={(e) => setData('title', e.target.value)} type="text" name="title" id="title" className="block pt-6 px-2.5 w-full text-lg h-14 bg-white text-gray-900 rounded-lg dark:bg-gray-700 border-0  border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required/>
                    <label htmlFor="title" className="z-30 peer-focus:font-medium absolute text-md text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 left-2.5 top-4 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:translate-x-2">Title</label>
                </div>
                <FormField onChange={handleChangeID} id="customer_id"  colspan="sm:col-span-4" type="number" placeholder="Customer ID" required={true} value={data.customer_id}/>
                <FormField onChange={e => setData('service_order', e.target.value)} id="service_order"  colspan="sm:col-span-6" type="number" placeholder="Service Order" required={true} value={data.service_order}/>
                <FormFieldDate value={data.date} onChange={e => setData('date', e.target.value)} />
                <FormField onChange={()=>{}} id="name" colspan="sm:col-span-full" type="text" placeholder="Pharmacy's Name" required={true} value={pharmacy}/>
                <FormField onChange={e => setData('equipment', e.target.value)} id="equipment"  colspan="sm:col-span-full" type="text" placeholder="Equipment" required={true} value={data.equipment}/>
                <FormField onChange={e => setData('problem', e.target.value)} id="problem"  colspan="sm:col-span-full" type="text" placeholder="Problem" required={true} value={data.problem}/>
                <FormFieldTextarea onChange={e => setData('note', e.target.value)} id="note"  colspan="sm:col-span-full" type="textarea" placeholder="Note" required={true} value={data.note} row={3}/>                
                <LoanerSelection addLoaner={addLoaner} allLoaners={all}/>
                
                <div className="flex flex-wrap col-span-full">
                        {data.loaners.map((loaner) =>
                            <div key={loaner.id} className="flex justify-center items-center p-2 rounded-lg mr-3 mb-3 border bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" controlid="Loaner">
                                <div className="mr-2 dark:text-white">{loaner.device} #{loaner.name}</div>
                                <button type="button" onClick={() => removeLoaner(loaner)} className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-1 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">-</button>
                            </div>)}
                </div>
            </div>
            <button type="submit" disabled={processing} className="inline-flex focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                <svg className="mr-1 -ml-1 w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path></svg>
                Add new task
            </button>
        </form>
    </main>
)}

function FormField({onChange, id, colspan, type, placeholder, required, value}) {
    return (
    <div className={colspan}>
        <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{placeholder}</label>
        <input value={value} onChange={onChange} type={type} name={id} id={id} className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder={placeholder} required={required} rows="3"/>
    </div>);
}

function FormFieldTextarea({onChange, id, colspan, placeholder, value}) {
    return (
    <div className={colspan}>
        <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{placeholder}</label>
        <textarea value={value} onChange={onChange} name={id} id={id} className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder={placeholder} rows="3"/>
    </div>);
}

function FormFieldDate({onChange, value}) {
    return (
        <div className="sm:col-span-8">
            <div className="relative">
                <label htmlFor="date" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Date</label>
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pt-7 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                    </svg>
                </div>
                <input value={value} onChange={onChange} id="datepickerId" type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Select date" />
            </div>
        </div>);
}