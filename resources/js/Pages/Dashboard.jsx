import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useForm } from '@inertiajs/react'
import { useContext, useState, useEffect, useRef } from 'react';
import TaskCard from './Task/TaskCard'
import LoanerCard from './LoanerCard'

export default function Dashboard({tasks, loaners}) {
    const [selectedTask, setSelectedTask] = useState(0);
    const [detail, setDetail] = useState({});
    const { data, setData, patch } = useForm({
        status_id: 0
    })
    
    const inputElement = useRef('');

    //Using inputElement to check if it's the first render
    //to prevent useEffect to run on initial render
    useEffect(() => {
        if(inputElement.current != '') {
            patch(`/task/${detail.id}`)
            inputElement.current.hide()
        }
    }, [data])


    useEffect(() => {
        const modalEl = document.getElementById('defaultModal');
        const options = {
            backdropClasses: 'bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40',
            closable: true,
        }
        inputElement.current = new Modal(modalEl, options)
        console.log(loaners)
    }, []);

    function handleClick(id) {
        inputElement.current.show()
        setDetail(...tasks.filter((task) => task.id == id))
    }

    return (
        <>
        {/* <AuthenticatedLayout */}
            {/* user={auth.user} */}
            {/* header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Dashboard</h2>} */}
        {/* > */}
        
            <Head title="Dashboard" />
            
            <div className="grid grid-cols-12 divide-x-2 dark:divide-gray-800">
                    <div className="grid col-span-6 p-6 grid grid-rows-6">
                        <h1 className="h-4 text-lg text-gray-900 dark:text-white mb-4 col-span-full row-start-1 row-end-1">Ready To Go</h1>
                        <div className="h-4 row-start-2 row-end-6 grid grid-cols-3">
                            {tasks.filter((task) => task.status_id == 5).map((task) =>
                                <TaskCard key={task.id} task={task} handleClick={handleClick}/>
                            )}
                        </div>
                    </div>

                    <div className="grid col-span-6 p-6 grid grid-rows-6">
                        <h1 className="h-4 text-lg text-gray-900 dark:text-white mb-4 col-span-full row-start-1 row-end-1">Not Ready</h1>
                        <div className="h-4 row-start-2 row-end-6 grid grid-cols-3">
                            {tasks.filter((task) => task.status_id < 5).map((task) =>
                                <TaskCard key={task.id} task={task} handleClick={handleClick}/>
                            )}
                        </div>
                    </div>
            </div>

                {/* Loop through mainCategory array, in each category: loop through the number of loaner */}
                {/* loaners.reduce is used to find the number of loaners in each category, then only render category with positive number */}
                {/* <div className="grid col-span-full m-6">
                        <h1 className="text-lg text-gray-900 dark:text-white mb-4">Loaner Status:</h1>
                        {mainCategory.map((category) => loaners.reduce((acc, cur) => cur.category === category ? ++acc : acc, 0) != 0 &&
                            <div key={category} className="grid grid-cols-6">
                                <h1 className="text-lg text-gray-900 dark:text-white mb-4 col-span-full ">{category}</h1>
                                {loaners.map((loaner) => loaner.category == category &&
                                    <LoanerCard key={loaner.id} loaner={loaner}/>)}
                            </div>)}
                        
                </div> */}

                <div className="mt-20 flex col-span-full flex-col">
                    <h1 className="text-lg text-gray-900 dark:text-white mb-4">Loaner Status:</h1>
                    <h3 className="text-sm text-gray-900 dark:text-white my-4 row-span-1 col-span-full">COMPUTERS</h3>
                    <div className="grid grid-cols-8">
                        <div className="flex col-span-3">
                        {loaners.map((loaner) => loaner.category_id == 9 &&
                            <LoanerCard key={loaner.id} loaner={loaner}/>)}
                        </div >
                        <div className="flex col-start-5 col-span-5">
                            {loaners.map((loaner) => loaner.category_id == 1 &&
                                <LoanerCard key={loaner.id} loaner={loaner}/>)}
                        </div>
                    </div>
                    <h3 className="text-sm text-gray-900 dark:text-white my-4 row-span-1 col-span-full">PRINTERS</h3>
                    <div className="grid grid-cols-8">
                        <div className="flex flex-wrap col-span-4">
                            {loaners.map((loaner) => (loaner.category_id == 3) &&
                                    <LoanerCard key={loaner.id} loaner={loaner}/>)}        
                        </div>

                        <div className="flex flex-wrap col-start-6 col-span-4">
                            {loaners.map((loaner) => (loaner.category_id == 5) &&
                                    <LoanerCard key={loaner.id} loaner={loaner}/>)}        
                        </div>
                    </div>   

                </div>

                <div id="defaultModal" tabIndex="-1" aria-hidden="true" className="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
                    <div className="relative w-full max-w-2xl max-h-full">
                        {/* <!-- Modal content --> */}
                        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                            {/* <!-- Modal header --> */}
                            <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                                <div>
                                    <h3 className="text-2xl mb-3 font-bold text-gray-900 dark:text-white">
                                        {detail.title} - SO#{detail.service_order}
                                    </h3>
                                    <h4 className="text-xl mb-3 text-gray-900 dark:text-white">
                                        {('000' + detail.customer_id).slice(-4)} - {detail.customer_name}
                                    </h4>
                                    <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400 italic">Received on {detail.date}, picked up by {detail.user}</p>
                                </div>

                                <button onClick={() => inputElement.current.hide()} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div>
                            {/* <!-- Modal body --> */}
                            <div className="p-6 space-y-6">
                                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">Status: {detail.status}</p>
                                
                                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">Problem: {detail.problem}</p>
                                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">Note: {detail.note}</p>
                            </div>
                            {/* <!-- Modal footer --> */}
                            <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
                                <a href={`/task/${detail.id}/edit`} type="button"
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                                    Modify
                                </a>
                                <button onClick={() => setData('status_id', 5)} type="button" className=" bg-white  focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-sm font-medium px-5 py-2.5  focus:z-10 dark:hover:text-white text-white bg-green-700 hover:bg-green-800 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Ready</button>
                                <button onClick={() => setData('status_id', 6)} type="button" className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900">Complete</button>
                                <button onClick={() => inputElement.current.hide()} type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
        {/*</AuthenticatedLayout*>*/}
        </>
    );
}
