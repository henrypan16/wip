import CreateTask from './Task/CreateTask'
import Dashboard from './Dashboard'
import { initFlowbite } from 'flowbite'
import { Head } from '@inertiajs/react';

export default function Welcome({ customers, allLoaners}) {
    initFlowbite();

    return (
        <>
            <Dashboard/>
            <CreateTask id="createTaskModel" customers={customers} allLoaners={allLoaners}/>
        </>
    );
}
