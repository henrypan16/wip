'use client';

import { useState, useTransition } from 'react';
import { createTask } from '@/actions/tasks';
import { FormField, InputError } from '@/components/Form';
import { today } from '@/lib/format';
import LoanerItem from './LoanerItem';
import LoanerSelection from './LoanerSelection';
import useCustomerLookup from './useCustomerLookup';

// Keep only digits and zero-pad to a fixed width, e.g. customer IDs '0451'.
const padded = (value, width) => {
    const digits = value.replace(/\D/g, '');
    return digits ? digits.padStart(width, '0').slice(-width) : '';
};

export default function CreateTaskForm({ allLoaners }) {
    const [all, setAll] = useState(allLoaners);
    const [errors, setErrors] = useState({});
    const [processing, startTransition] = useTransition();
    const [data, setFormData] = useState({
        customer_id: '',
        customer_name: '',
        service_order: '',
        title: '',
        date: today(),
        equipment: '',
        problem: '',
        note: '',
        loaners: [],
    });
    const setData = (key, value) => setFormData((d) => ({ ...d, [key]: value }));

    useCustomerLookup(data.customer_id, data.customer_name, (name) => setData('customer_name', name));

    function addLoaner(selectedLoaner) {
        setAll(all.filter((loaner) => loaner.id !== selectedLoaner.id));
        setData('loaners', [...data.loaners, selectedLoaner]);
    }

    function removeLoaner(selectedLoaner) {
        setAll([...all, selectedLoaner].sort((a, b) => a.id - b.id));
        setData('loaners', data.loaners.filter((loaner) => loaner.id !== selectedLoaner.id));
    }

    function submit(e) {
        e.preventDefault();
        startTransition(async () => {
            const result = await createTask({
                ...data,
                loaners: data.loaners.map(({ id, note }) => ({ id, note })),
            });
            setErrors(result?.errors ?? {});
        });
    }

    return (
        <div className="dark:bg-gray-900 sm:px-10 md:px-0 lg:px-18 2xl:px-60 pt-12 px-2">
            <form onSubmit={submit} className="w-full">
                <div className="grid gap-4 mb-4 grid-cols-8">
                    <div className="col-span-full sm:col-span-4 mb-6 flex items-center">
                        <span className="text-3xl font-bold dark:text-white">Create New Task</span>
                    </div>
                    <div className="col-span-full sm:col-span-4">
                        <FormField id="title" type="title" value={data.title} maxLength={100} error={errors.title}
                            onChange={(e) => setData('title', e.target.value)} placeholder="Title" />
                    </div>
                    <div className="col-span-full sm:col-span-2">
                        <FormField id="customer_id" type="text" inputMode="numeric" value={data.customer_id} error={errors.customer_id}
                            onChange={(e) => setData('customer_id', padded(e.target.value, 4))} placeholder="Customer ID" />
                    </div>
                    <div className="col-span-full sm:col-span-3">
                        <FormField id="service_order" type="text" inputMode="numeric" value={data.service_order} error={errors.service_order}
                            onChange={(e) => setData('service_order', padded(e.target.value, 6))} placeholder="Service Order" />
                    </div>
                    <div className="col-span-full sm:col-span-3">
                        <FormField id="date" type="date" value={data.date} error={errors.date}
                            onChange={(e) => setData('date', e.target.value)} placeholder="Receive Date" />
                    </div>
                    <div className="col-span-full">
                        <FormField id="customer_name" value={data.customer_name} maxLength={50} error={errors.customer_name}
                            onChange={(e) => setData('customer_name', e.target.value)} placeholder="Customer's Name" />
                    </div>
                    <div className="col-span-full">
                        <FormField id="equipment" value={data.equipment} maxLength={60} error={errors.equipment}
                            onChange={(e) => setData('equipment', e.target.value)} placeholder="Equipment" />
                    </div>
                    <div className="col-span-full">
                        <FormField id="problem" value={data.problem} maxLength={60} error={errors.problem}
                            onChange={(e) => setData('problem', e.target.value)} placeholder="Problem" />
                    </div>
                    <div className="col-span-full">
                        <FormField id="note" type="textarea" value={data.note} maxLength={255} error={errors.note}
                            onChange={(e) => setData('note', e.target.value)} placeholder="Note" />
                    </div>
                    <div className="col-span-full grid grid-cols-12 gap-2 items-center">
                        <LoanerSelection addLoaner={addLoaner} allLoaners={all} />
                    </div>
                    <div className="flex flex-wrap col-span-full">
                        {data.loaners.map((loaner) => <LoanerItem key={loaner.id} removeLoaner={removeLoaner} loaner={loaner} />)}
                    </div>
                    <div className="col-span-full -mt-4">
                        <InputError message={errors.loaners} />
                    </div>
                </div>
                <button type="submit" disabled={processing} className="inline-flex focus:outline-hidden text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 disabled:opacity-60">
                    <svg className="mr-1 -ml-1 w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path></svg>
                    Add new task
                </button>
            </form>
        </div>
    );
}
