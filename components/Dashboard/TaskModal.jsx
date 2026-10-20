'use client';

import Link from 'next/link';
import { useTransition } from 'react';
import { setTaskStatus } from '@/actions/tasks';
import CloseButton from '@/components/CloseButton';
import Modal from '@/components/Modal';
import { STATUS } from '@/lib/constants';
import { formatDate, padCustomerId } from '@/lib/format';

export default function TaskModal({ task, onClose }) {
    const [pending, startTransition] = useTransition();

    function changeStatus(status) {
        startTransition(async () => {
            await setTaskStatus(task.id, status);
            onClose();
        });
    }

    return (
        <Modal show={!!task} onClose={onClose}>
            {task && (
                <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
                    <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                        <div>
                            <h3 className="text-2xl mb-3 font-bold text-gray-900 dark:text-white">
                                {task.title || task.equipment}{task.service_order ? ` - SO#${task.service_order}` : ''}
                            </h3>
                            <h4 className="text-xl mb-3 text-gray-900 dark:text-white">
                                {padCustomerId(task.customer_id)} - {task.customer_name}
                            </h4>
                            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400 italic">
                                Received on {formatDate(task.date)}{task.user ? `, picked up by ${task.user}` : ''}
                            </p>
                        </div>
                        <CloseButton onClick={onClose} />
                    </div>

                    <div className="p-6 space-y-6">
                        <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">Status: {task.status}</p>
                        <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">Equipment: {task.equipment}</p>
                        <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">Problem: {task.problem}</p>
                        <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">Note: {task.note}</p>
                    </div>

                    <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
                        <Link href={`/task/${task.id}/edit`}
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-hidden dark:focus:ring-blue-800">
                            Modify
                        </Link>
                        <button onClick={() => changeStatus(STATUS.READY)} disabled={pending} type="button" className="focus:ring-4 focus:outline-hidden rounded-lg text-sm font-medium px-5 py-2.5 focus:z-10 dark:hover:text-white text-white bg-green-700 hover:bg-green-800 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 disabled:opacity-60">Ready</button>
                        <button onClick={() => changeStatus(STATUS.COMPLETE)} disabled={pending} type="button" className="focus:outline-hidden text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900 disabled:opacity-60">Complete</button>
                        <button onClick={onClose} type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-hidden focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">Close</button>
                    </div>
                </div>
            )}
        </Modal>
    );
}
