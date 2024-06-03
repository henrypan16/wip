import { Link, Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { useForm, usePage } from '@inertiajs/react'
import LoanerSelection from './LoanerSelection'
import { format } from 'date-fns'
import { FormField, FormFieldDate, FormFieldTextarea, FormFieldTitle, FormFieldOption } from '@/Components/Form'
import LoanerItem from './LoanerItem'

export default function CreateTask({allLoaners, customers, users}) {
    const {auth} = usePage().props;
    const TODAY = format(new Date(), 'dd/MM/yyyy')
    const [all, setAll] = useState(allLoaners);
    const [pharmacy, setPharmacy] = useState('');
    const [date, setDate] = useState(TODAY);
    const { data, setData, post, processing, errors } = useForm({
        customer_id: '',
        customer_name: '',
        user_id: auth.id,
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
    console.log(auth);
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
    <div className="dark:bg-gray-900  sm:px-10 md:px-0 lg:px-18 2xl:px-60 pt-12 px-2">
        <Head title="New Task"></Head>
        
        <form onSubmit={submit} className="w-full">
            <div className="grid gap-4 mb-4 grid-cols-8">
                <div className="col-span-full sm:col-span-4 mb-6 flex items-center">
                    <span className="text-3xl text-bold dark:text-white">Create New Task</span>
                </div>
                <div className="col-span-full sm:col-span-4">
                    <FormField  value={data.customer_id} type="title"
                                onChange={e => setData('customer_id', ('000' + e.target.value).slice(-4))}
                                placeholder="Customer ID"/>
                </div>
                <div className="col-span-2">
                    <FormField  value={data.customer_id} type="number"
                                onChange={e => setData('customer_id', ('000' + e.target.value).slice(-4))}
                                placeholder="Customer ID"/>
                </div>
                <div className="col-span-3">
                    <FormField  value={data.service_order} type="number"
                                onChange={e => setData('service_order', ('00000' + e.target.value).slice(-6))}
                                placeholder="Number"/>
                </div>   
                <div className="col-span-3">
                    <FormField value={date} type="date" id="date"
                               onChange={e => setDate(e.target.value)}
                               placeholder="Receive Date"/>
                </div>
                <div className="col-span-full">
                    <FormField  value={data.customer_name} type="text"
                                onChange={e => setData('customer_name', e.target.value)}
                                placeholder="Customer's Name"/>
                </div>
                <div className="col-span-full">
                    <FormField  value={data.equipment} type="text"
                                onChange={e => setData('equipment', e.target.value)}
                                placeholder="Equipment"/>
                </div>
                <div className="col-span-full">
                    <FormField  value={data.problem} type="text"
                                onChange={e => setData('problem', e.target.value)}
                                placeholder="Problem"/>
                </div>
                <div className="col-span-full">
                    <FormField  value={data.note} type="textarea"
                                onChange={e => setData('note', e.target.value)}
                                placeholder="Note"/> 
                </div>       
                <div className="col-span-full flex sm:grid sm:grid-cols-12 gap-2">
                    <LoanerSelection addLoaner={addLoaner} allLoaners={all}/>
                </div>
                
                <div className="flex col-span-full">
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







