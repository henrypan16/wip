import { Link, Head } from '@inertiajs/react';
import { useState } from 'react';
import { router } from '@inertiajs/react'
import { useForm } from '@inertiajs/react'
import LoanerSelection from './Task/LoanerSelection'
import LoanerRemoval from './Task/LoanerRemoval'
import CreateTask from './Task/CreateTask'
import Navbar from './Navbar/Navbar'
import Sidebar from './Sidebar/Sidebar'
import Dashboard from './Dashboard'
import MainLayout from '../Layouts/MainLayout'
import { initFlowbite } from 'flowbite'

export default function Welcome({ customers, allLoaners}) {
    initFlowbite();

    return (
        <>
            <Dashboard />
            <CreateTask id="defaultModal" customers={customers} allLoaners={allLoaners}/>
        </>
    );
}

Welcome.layout = page => <MainLayout children={page} title="Welcome"/>
