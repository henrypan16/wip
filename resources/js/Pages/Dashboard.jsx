import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useForm } from '@inertiajs/react'
import { useContext, useState, useEffect, useRef, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom'
import TaskCard from '../Components/Dashboard/TaskCard'
import TaskSection from '../Components/Dashboard/TaskSection'
import LoanerCard from '../Components/Dashboard/LoanerCard'
import LoanerSection from '../Components/Dashboard/LoanerSection'

function useWindowSize() {
    const [size, setSize] = useState([0, 0]);
    useLayoutEffect(() => {
      function updateSize() {
        setSize([window.innerWidth, window.innerHeight]);
      }
      window.addEventListener('resize', updateSize);
      updateSize();
      return () => window.removeEventListener('resize', updateSize);
    }, []);
    return size;
}

export default function Dashboard({tasks, loaners}) {
    const [selectedTask, setSelectedTask] = useState(0);
    const [maxTask, setMaxTask] = useState(7);
    const [detail, setDetail] = useState({});
    const { data, setData, patch } = useForm({
        status_id: 0
    })
    const [width, height] = useWindowSize();
    
    const inputElement = useRef('');

    
    //Using inputElement to check if it's the first render
    //to prevent useEffect to run on initial render
    useEffect(() => {
        if(inputElement.current != '' && detail.id > 0 ) {
            patch(`/task/${detail.id}`)
            inputElement.current.hide()
        }
    }, [data])

    useEffect(() => {
        if(width > 1423) setMaxTask(8)
        else if(width > 1280) setMaxTask(7)
        else if(width > 1024) setMaxTask(11)
        else if(width > 872) setMaxTask(8)
        else if(width > 768) setMaxTask(7)
        else if(width > 600) setMaxTask(8)
        else setMaxTask(7)
    }, [width])
    

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
        console.log(window.innerWidth)
    }

    return (
        <>
      
            <Head title="Dashboard" />
            <div className="flex flex-col h-full mx-10 mt-0">
                <div className="xl:flex dark:divide-gray-800 mb-4">
                    <TaskSection tasks={tasks.filter((task) => task.status_id == 5).slice(0,maxTask)} click={handleClick} title="Ready To Go"/>
                    <TaskSection tasks={tasks.filter((task) => task.status_id < 5).slice(0,maxTask)} click={handleClick} title="Not Ready"/>
                </div>
                <div className="hidden xl:block">
                    <h1 className="text-lg text-gray-900 dark:text-white">Loaner Status:</h1>
                    <div className="flex w-11/12">
                        <LoanerSection loaners={loaners.filter((loaner) => loaner.category_id == 9)} title="Backpack Computers"/>
                        <LoanerSection loaners={loaners.filter((loaner) => loaner.category_id == 1)} title="Tower Computers"/>
                        <LoanerSection loaners={loaners.filter((loaner) => loaner.category_id == 3)} title="Laser Printers"/>
                        <LoanerSection loaners={loaners.filter((loaner) => loaner.category_id == 5)} title="Thermal Printers"/>
                    </div>
                </div>
            </div>


                {createPortal(<div id="defaultModal" tabIndex="-1" aria-hidden="true" className="absolute top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
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
                                <button onClick={() => setData('status_id', 5)} type="button" className="focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-sm font-medium px-5 py-2.5  focus:z-10 dark:hover:text-white text-white bg-green-700 hover:bg-green-800 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Ready</button>
                                <button onClick={() => setData('status_id', 6)} type="button" className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900">Complete</button>
                                <button onClick={() => inputElement.current.hide()} type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">Close</button>
                            </div>
                        </div>
                    </div>
                </div>, document.body)}
        {/*</AuthenticatedLayout*>*/}
        </>
    );
}
