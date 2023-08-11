import { Link, Head } from '@inertiajs/react';
import { useState } from 'react';
import { router } from '@inertiajs/react'
import { useForm } from '@inertiajs/react'
import LoanerSelection from './Task/LoanerSelection'
import LoanerRemoval from './Task/LoanerRemoval'

export default function index({ customers, allLoaners}) {
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
        <>
            <Head title="FTWIP" />
            <nav>

                <a href="#home">FTWIP</a>
                <ul className="me-auto">
                    <li href="#home">Home</li>
                    <li href="#features">Features</li>
                    <li href="#pricing">Pricing</li>
                </ul>
            </nav>
            <form>
                <div className="mb-3">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="customer">Customer</label>
                    <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={id} onChange={handleChange} type="number" placeholder="Customer ID"/>
                    <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={pharmacy} type="text" readOnly={true} placeholder="Pharmacy Name"/>
                </div>


                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tag#</label>
                    <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" type="number" placeholder="" />
                </div>

                <div className="mb-3" controlid="Date">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">SO#</label>
                    <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" type="number"/>
                </div>

                <div className="mb-3" controlid="Date">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Date</label>
                    <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={date} onChange={handleDateChange} type="date"/>
                </div>

                <div className="mb-3" controlid="Equipment">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Equipment</label>
                    <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" type="text" placeholder=""/>
                </div>

                <div className="mb-3" controlid="Problem">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Problem</label>
                    <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" type="text" placeholder="" />
                </div>

                <div className="mb-3" controlid="Status">
                    <label>Status</label>
                    <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <option>Open this select menu</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                    </select>
                </div>
                
                
                <LoanerSelection addLoaner={addLoaner} allLoaners={allLoaners}/>
                <div className="flex flex-wrap">
                        {loaners.map((loaner) => <LoanerRemoval key={loaner.id} removeLoaner={removeLoaner} loaner={loaner}/>)}
                </div>
                

                <button variant="primary" type="submit">
                        Submit New Task
                </button>
                
                <button type="submit">
                    Save Change
                </button>
            </form>
            <button type="button">Previous</button>
            <button type="button">Next</button>
            <button type="button">Go To First</button>
            <button type="button">Go To End</button>
        </>
    );
}
