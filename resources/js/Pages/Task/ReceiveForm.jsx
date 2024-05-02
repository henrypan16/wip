
import { Link, Head } from '@inertiajs/react';
import { useState, useContext, useRef, useEffect} from 'react';
import { router } from '@inertiajs/react'
import { useForm } from '@inertiajs/react'
import LoanerSelection from './LoanerSelection'
import { initFlowbite } from 'flowbite'
import Datepicker from 'flowbite-datepicker/Datepicker';
import { format } from 'date-fns'
import { FormField, FormFieldDate, FormFieldTextarea, FormFieldTitle } from '@/Components/Form'
import ReceiveItems from './ReceiveItems'

export default function CreateInstallation({allLoaners, customers}) {
    const [isChecked, setIsChecked] = useState(false);
    const [all, setAll] = useState(allLoaners);
    const [pharmacy, setPharmacy] = useState('');
    const { data, setData, post, processing, errors } = useForm({
        customer_id: '',
        user_id: 1,
        dropoff_date: String(format(new Date(), 'dd/MM/yyyy')),
        inspect_date: String(format(new Date(), 'dd/MM/yyyy')),
        contact_number: '',
        contact_person: '',
        dropoff_person: '',
        equipment: [],
        note: '',
        status_id: 1,
        type_id: 3
    })

    const inputElement = useRef('');
    useEffect(() => {
        const modalEl = document.getElementById('defaultModal');
        const options = {
            backdropClasses: 'bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40',
            closable: true,
        }
        inputElement.current = new Modal(modalEl, options);

    }, []);

    const [pcList, setPcList] = useState([]);

    function addPc(pc) {
        setPcList([...pcList, pc]);
        console.log(pcList);
    }

    function removePc(id) {
        setPcList(pcList.filter(pcItem => pcItem.id != id));
    }

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

    function submit(e) {
        e.preventDefault();
        post('/tasks');
    }

  return (
    <main className={`dark:bg-gray-900 px-5 sm:px-10 md:px-5 lg:pt-30 lg:px-32 2xl:px-80 pt-12`}>
        <Head title="3rd Party Items"></Head>
        
        <form onSubmit={submit}>
            <div className="grid gap-4 mb-4 sm:grid-cols-18">
                <div className="sm:col-span-full mb-6 flex items-center">
                    <span className="text-3xl text-bold dark:text-white">Receive 3rd Party Items</span>
                </div>

                {/* Normal FormField component, but with added checkbox on the label */}
                <div className="sm:col-span-4">
                    <label htmlFor="customer_id" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        <input type="checkbox" checked={isChecked} onChange={() => setIsChecked(!isChecked)} aria-label="Checkbox for following text input" name="check" id="date" className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" required=""/>
                        <label htmlFor="date" className="items-center ml-2 text-sm font-medium text-gray-900 dark:text-white">Prospect</label>
                    </label>
                    <input value={data.customer_id} onChange={handleChangeID} type="number" name="customer_id" id="customer_id" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Customer ID" required/>
                </div>
                
                <FormFieldDate id="dropoff_date" colspan="sm:col-span-6" value={data.dropoff_date} onChange={e => setData('dropoff_date', e.target.value)} placeholder="Dropoff Date"/>
                <FormFieldDate id="inspect_date" colspan="sm:col-span-6" value={data.inspect_date} onChange={e => setData('inspect_date', e.target.value)} placeholder="Inspect Date"/>
                <FormField onChange={()=>{}} id="name" colspan="sm:col-span-full" type="text" placeholder="Pharmacy's Name" required={true} value={pharmacy}/>
                <FormField onChange={e => setData('dropoff_person', e.target.value.toUpperCase())} id="dropoff_person" colspan="sm:col-span-6" type="text" placeholder="Dropoff Person" required={true} value={data.dropoff_person}/>
                <FormField onChange={e => setData('contact_person', e.target.value.toUpperCase())} id="contact_person" colspan="sm:col-span-6" type="text" placeholder="Contact Person" required={true} value={data.contact_person}/>
                <FormField onChange={e => setData('contact_number', e.target.value)} id="contact_number" colspan="sm:col-span-6" type="text" placeholder="Contact Number" required={true} value={data.contact_number}/>
                <ReceiveItems pcList={pcList} addPc={addPc} removePc={removePc}/>
                <FormFieldTextarea onChange={e => setData('note', e.target.value)} id="note" colspan="sm:col-span-full" type="textarea" placeholder="Note" required={true} value={data.note}/>
            </div>
            <button onClick={() => inputElement.current.show()} type="button" disabled={processing}
            className="inline-flex focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                <svg className="mr-1 -ml-1 w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path></svg>
                Generate Log
            </button>

            <div id="defaultModal" tabIndex="-1" aria-hidden="true" className="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
                    <div className="relative w-full max-w-2xl max-h-full">
                        {/* <!-- Modal content --> */}
                        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                            {/* <!-- Modal header --> */}
                            <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                                <button onClick={() => inputElement.current.hide()} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div>
                            {/* <!-- Modal body --> */}
                            <div className="p-6 space-y-6">
                                <div className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                                    <p>
                                    INSPECTION: I received a Third Party PC dropped off by {data.dropoff_person} for inspection and configuration. The specification of the PC is as follows.<br/>
                                    </p>


                                {pcList.map(pc =>
                                    <p>
                                        #{pc.motherboard} / Intel(R) Core(TM) {pc.cpu} / {pc.ram} RAM / {pc.disk} / Windows {pc.os} ACTIVATED
                                    </p>)}
                                    
                                    <p>Dropped off by: {data.dropoff_person}&emsp;
                                    Contact Person: {data.contact_person}<br/>
                                    Dropped off on: {data.dropoff_date}&emsp;&emsp;&emsp;
                                    Cell No: {data.contact_number}<br/>
                                    Inspected on: {data.inspect_date}</p>


                                

                                <p>Notes:<br/>
                                {data.note == '' ? <>{data.note}</> : null}
                                {pcList.map(pc => {return pc.gpu_ports == '' ?
                                    <>
                                        **{pc.motherboard} has {pc.usb_front} USB ports at the FRONT, {pc.usb_back} USB ports at the BACK.<br/>
                                        **{pc.motherboard} has {pc.motherboard_ports} on the motherboard for video connection.<br/>
                                    </> : 
                                    <>
                                        **{pc.motherboard} has {pc.usb_front} USB ports at the FRONT, {pc.usb_back} USB ports at the BACK.<br/>
                                        **{pc.motherboard} has {pc.motherboard_ports} on the motherboard for video connection.<br/>
                                        **{pc.motherboard} has {pc.gpu_ports} on the video card for video connection.
                                    </>})}
                                </p>
                                </div>
                            </div>
                            {/* <!-- Modal footer --> */}
                        </div>
                    </div>
                </div>
        </form>
    </main>
  )
}
