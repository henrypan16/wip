'use client';

import Link from 'next/link';
import { useState, useTransition } from 'react';
import { updateTask } from '@/actions/tasks';
import { FormField, FormFieldSelect } from '@/components/Form';
import { formatDate, padCustomerId } from '@/lib/format';

export default function UpdateTaskForm({ task, status }) {
    const [errors, setErrors] = useState({});
    const [processing, startTransition] = useTransition();
    const [data, setFormData] = useState({
        title: task.title ?? '',
        equipment: task.equipment ?? '',
        problem: task.problem ?? '',
        note: task.note ?? '',
        status_id: task.status_id,
    });
    const setData = (key, value) => setFormData((d) => ({ ...d, [key]: value }));

    function submit(e) {
        e.preventDefault();
        startTransition(async () => {
            const result = await updateTask(task.id, data);
            setErrors(result?.errors ?? {});
        });
    }

    return (
        <div className="dark:bg-gray-900 px-5 sm:px-10 md:px-5 lg:px-32 2xl:px-80 pt-12">
            <form onSubmit={submit}>
                <div className="grid gap-4 mb-4 sm:grid-cols-18">
                    <div className="sm:col-span-8 mb-6 flex items-center">
                        <span className="text-3xl font-bold dark:text-white">Update Task</span>
                    </div>
                    <div className="sm:col-span-10">
                        <FormField id="title" type="title" value={data.title} maxLength={100} error={errors.title}
                            onChange={(e) => setData('title', e.target.value)} placeholder="Title" />
                    </div>
                    <div className="sm:col-span-4">
                        <FormField id="customer_id" value={padCustomerId(task.customer_id)} readOnly placeholder="Customer's ID" />
                    </div>
                    <div className="sm:col-span-6">
                        <FormField id="service_order" value={task.service_order ?? ''} readOnly required={false} placeholder="Service Order" />
                    </div>
                    <div className="sm:col-span-8">
                        <FormField id="date" value={formatDate(task.date)} readOnly placeholder="Date" />
                    </div>
                    <div className="sm:col-span-full">
                        <FormField id="name" value={task.customer_name} readOnly placeholder="Pharmacy's Name" />
                    </div>
                    <div className="sm:col-span-full">
                        <FormField id="equipment" value={data.equipment} maxLength={60} error={errors.equipment}
                            onChange={(e) => setData('equipment', e.target.value)} placeholder="Equipment" />
                    </div>
                    <div className="sm:col-span-full">
                        <FormField id="problem" value={data.problem} maxLength={60} error={errors.problem}
                            onChange={(e) => setData('problem', e.target.value)} placeholder="Problem" />
                    </div>
                    <div className="sm:col-span-full">
                        <FormField id="note" type="textarea" value={data.note} maxLength={255} error={errors.note}
                            onChange={(e) => setData('note', e.target.value)} placeholder="Note" />
                    </div>
                    <div className="sm:col-span-full">
                        <FormFieldSelect id="status_id" placeholder="Status" options={status} value={data.status_id} error={errors.status_id}
                            onChange={(e) => setData('status_id', e.target.value)} />
                    </div>
                </div>
                <button type="submit" disabled={processing}
                    className="inline-flex focus:outline-hidden text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 disabled:opacity-60">
                    Update
                </button>
                <Link href="/dashboard"
                    className="inline-flex text-gray-900 bg-white border border-gray-300 focus:outline-hidden hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                    Return
                </Link>
            </form>
        </div>
    );
}
