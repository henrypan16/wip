import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useContext, useState, useEffect, useRef } from 'react';
import TaskCard from './Task/TaskCard'

export default function Dashboard({tasks}) {
    const [selectedTask, setSelectedTask] = useState(0);
    const [detail, setDetail] = useState({});
    const inputElement = useRef('');
    useEffect(() => {
        const modalEl = document.getElementById('defaultModal');
        const options = {
            backdropClasses: 'bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40',
            closable: true,
        }
        inputElement.current = new Modal(modalEl, options);

    }, []);


    function handleClick(id) {
        inputElement.current.show();
        setDetail(...tasks.filter((task) => task.id == id));
    }

    return (
        <>
        {/* <AuthenticatedLayout */}
            {/* user={auth.user} */}
            {/* header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Dashboard</h2>} */}
        {/* > */}
        
            <Head title="Dashboard" />
            <main className="dark:bg-gray-900 h-screen p-4 md:ml-64 h-auto pt-20">
                <div className="grid grid-cols-12 divide-x-2 dark:divide-gray-800">
                    <div className="grid col-span-4 p-6">
                        <h1 className="h-4 text-lg text-gray-900 dark:text-white mb-4">Repair Order</h1>
                        {tasks.map((task) =>
                            <TaskCard key={task.id} task={task} handleClick={handleClick}/>
                        )}
                    </div>

                    <div className="grid col-span-4 p-6">
                        <h1 className="text-lg text-gray-900 dark:text-white mb-4 col-span-full">3rd Party Received</h1>
                        {tasks.map((task) =>
                            <TaskCard key={task.id} task={task} handleClick={handleClick}/>
                        )}
                    </div>

                    <div className="grid col-span-4 p-6">
                        <h1 className="text-lg text-gray-900 dark:text-white mb-4">HPR</h1>
                        {tasks.map((task) =>
                            <TaskCard key={task.id} task={task} handleClick={handleClick}/>
                        )}
                    </div>
                </div>
                <div className="grid col-span-full m-6">
                        <h1 className="text-lg text-gray-900 dark:text-white mb-4">Missing Loaners: </h1>
                </div>


                <div id="defaultModal" tabIndex="-1" aria-hidden="true" className="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
                    <div className="relative w-full max-w-2xl max-h-full">
                        {/* <!-- Modal content --> */}
                        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                            {/* <!-- Modal header --> */}
                            <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                                <div>
                                    <h3 className="text-2xl mb-3 font-bold text-gray-900 dark:text-white">
                                        {detail.type}: {detail.title} - SO#{detail.service_order}
                                    </h3>
                                    <h4 className="text-xl mb-3 text-gray-900 dark:text-white">
                                        {('000' + detail.customer_id).slice(-4)} - {detail.customer}
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
                                <a href={`/tasks/${detail.id}/edit`} type="button"
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                                    Modify
                                </a>
                                <button onClick={() => inputElement.current.hide()} type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        {/*</AuthenticatedLayout*>*/}
        </>
    );
}
