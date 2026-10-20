'use client';

import { useRef, useState, useTransition } from 'react';
import { saveLoanerNote } from '@/actions/loaners';
import { LOANER_AVAILABLE, LOANER_DISCONTINUED } from '@/lib/constants';
import { padCustomerId } from '@/lib/format';

// Hovering a card opens a small editor for the loaner's note.
export default function LoanerCard({ loaner }) {
    const [note, setNote] = useState(loaner.note ?? '');
    const [open, setOpen] = useState(false);
    const [pending, startTransition] = useTransition();
    const timer = useRef();

    const lentOut = loaner.status !== LOANER_AVAILABLE && loaner.status !== LOANER_DISCONTINUED;

    function show() {
        clearTimeout(timer.current);
        setOpen(true);
    }

    function hide() {
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setOpen(false), 200);
    }

    function handleOnClick() {
        startTransition(async () => {
            await saveLoanerNote(loaner.id, note);
            setOpen(false);
        });
    }

    return (
        <div className="relative" onMouseEnter={show} onMouseLeave={hide} onFocus={show}>
            <div className="w-28 mr-2 mb-2 block p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 overflow-hidden">
                <h1 className="mb-2 text-md font-bold tracking-tight text-gray-900 dark:text-white">
                    <span className="text-sm text-gray-700 dark:text-gray-400">{loaner.name}</span>
                </h1>
                <p className="text-sm text-gray-700 dark:text-gray-400 truncate">
                    {lentOut ? padCustomerId(loaner.status) : loaner.note || 'AVAILABLE'}
                </p>
            </div>

            {open && (
                <div className="absolute left-0 top-full z-10 bg-white rounded-lg shadow-sm w-44 dark:bg-gray-700 flex h-12">
                    <input value={note} onChange={(e) => setNote(e.target.value)} maxLength={255} aria-label={`Note for ${loaner.name}`}
                        className="my-2 ml-2 bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" />
                    <button onClick={handleOnClick} disabled={pending} className="focus:ring-4 focus:outline-hidden rounded-lg text-sm px-2 mx-2 my-2 font-medium focus:z-10 dark:hover:text-white text-white bg-green-700 hover:bg-green-800 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                        Save
                    </button>
                </div>
            )}
        </div>
    );
}
