import React from 'react'
import { Link, Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react'
import LoanerSelection from './LoanerSelection'
import { format } from 'date-fns'
import { FormField, FormFieldDate, FormFieldTextarea, FormFieldTitle, FormFieldOption } from '../FormComponents'
import LoanerItem from './LoanerItem'

export default function CreateTask({allLoaners, customers, users}) {
    const TODAY = format(new Date(), 'dd/MM/yyyy')
    const [all, setAll] = useState(allLoaners);
    const [pharmacy, setPharmacy] = useState('');
    const [date, setDate] = useState(TODAY);
    const { data, setData, post, processing, errors } = useForm({
        customer_id: '',
        customer_name: '',
        user_id: 1,
        service_order: '',
        title: '',
        date: TODAY,
        equipment: '',
        problem: '',
        note: '',
        loaners: [],
        status_id: 1,
        type_id: 1
    })
    
    useEffect(() => {
        setData('date', date)
    },[date])

    // function handleChangeID(e) {
    //     let newId = e.target.value;
    //     if(newId < 1) {
    //         setData('customer_id', '');
    //         setPharmacy('');
    //     } else if(newId > customers.length) {
    //         setData('customer_id', customers.length)
    //         setPharmacy(customers[customers.length-1].name);
    //     } else {
    //         setData('customer_id', newId);
    //         setPharmacy(customers[newId-1].name);
    //     }
    //     return;
    // }

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
        post('/task');
    }

  return (
    <div className="dark:bg-gray-900 px-5 sm:px-10 md:px-0 lg:px-18 2xl:px-60 pt-12">
        <Head title="New Task"></Head>
        
        <form onSubmit={submit}>
            <div className="grid gap-4 mb-4 sm:grid-cols-18">
                <div className="sm:col-span-8 mb-6 flex items-center">
                    <span className="text-3xl text-bold dark:text-white">Create New Task</span>
                </div>
                <FormFieldTitle onChange={e => setData('title', e.target.value)} placeholder="Title" value={data.title}/>
                <FormField onChange={e => setData('customer_id', ('000' + e.target.value).slice(-4))} formfields={{id:"customer_id", colspan:"sm:col-span-4", type:"number", placeholder:"Customer ID", required:true, value:data.customer_id}}/>
                <FormField onChange={e => setData('service_order', ('00000' + e.target.value).slice(-6))} formfields={{id:"service_order", colspan:"sm:col-span-6", type:"number", placeholder:"Service Order", required:true, value:data.service_order}}/>
                <FormFieldDate value={date} id="date" colspan="sm:col-span-4" onChange={e => setDate(e.target.value)} placeholder="Receive Date"/>
                <FormFieldOption id="user" colspan="sm:col-span-4" value={data.user_id} onChange={e => setData('user_id', e.target.value)} placeholder="Technician" users={users} required={true}/>
                <FormField onChange={e => setData('customer_name', e.target.value)} formfields={{id:"Pharmacy's Name", colspan:"sm:col-span-full", type:"number", placeholder:"Customer's Name", required:true, value:data.customer_name}}/>
                <FormField onChange={e => setData('equipment', e.target.value)} formfields={{id:"service_order", colspan:"sm:col-span-full", type:"number", placeholder:"Equipment", required:true, value:data.equipment}}/>
                <FormField onChange={e => setData('problem', e.target.value)} formfields={{id:"service_order", colspan:"sm:col-span-full", type:"number", placeholder:"Problem", required:true, value:data.problem}}/>
                <FormFieldTextarea onChange={e => setData('note', e.target.value)} id="note" colspan="sm:col-span-full" type="textarea" placeholder="Note" required={true} value={data.note} row={3}/>                
                <LoanerSelection addLoaner={addLoaner} allLoaners={all}/>
                
                <div className="flex flex-wrap col-span-full">
                        {data.loaners.map((loaner) =>
                            <LoanerItem key={loaner.id} removeLoaner={removeLoaner} loaner={loaner}  />)}
                </div>
            </div>
            <button type="submit" disabled={processing} className="inline-flex focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                <svg className="mr-1 -ml-1 w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path></svg>
                Add new task
            </button>
        </form>
    </div>
)}







