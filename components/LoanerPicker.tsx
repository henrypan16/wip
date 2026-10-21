'use client';

import { type ChangeEvent, useState } from 'react';
import { InputError, inputClass } from '@/components/Form';
import type { Loaner } from '@/lib/types';

// A loaner chosen for a task, with the note to lend it out with.
export type SelectedLoaner = Loaner & { note: string };

type LoanerPickerProps = {
    /** Every loaner that may be chosen; those already in `selected` are left out of the list. */
    choices: Loaner[];
    selected: SelectedLoaner[];
    onChange: (selected: SelectedLoaner[]) => void;
    error?: string;
};

/** Pick loaners by category, each with an optional note, shown as removable chips. */
export default function LoanerPicker({ choices, selected, onChange, error }: LoanerPickerProps) {
    const selectedIds = new Set(selected.map((loaner) => loaner.id));
    const remaining = choices.filter((loaner) => !selectedIds.has(loaner.id));

    return (
        <>
            <LoanerSelection allLoaners={remaining} addLoaner={(loaner) => onChange([...selected, loaner])} />
            {selected.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                    {selected.map((loaner) => (
                        <LoanerItem key={loaner.id} loaner={loaner} removeLoaner={() => onChange(selected.filter((l) => l.id !== loaner.id))} />
                    ))}
                </div>
            )}
            <InputError message={error} />
        </>
    );
}

const DEFAULT_CATEGORY = 'Select category';
const DEFAULT_LOANER = 'Select loaner';

function LoanerSelection({ addLoaner, allLoaners }: { addLoaner: (loaner: SelectedLoaner) => void; allLoaners: Loaner[] }) {
    const [selectedCategory, setSelectedCategory] = useState(DEFAULT_CATEGORY);
    const [selectedLoaner, setSelectedLoaner] = useState(DEFAULT_LOANER);
    const [note, setNote] = useState('');

    // Categories that still have a loaner to choose.
    const categories = [...new Set(allLoaners.map((item) => item.category))];
    const loaners = allLoaners.filter((x) => x.category === selectedCategory);

    function handleChangeCategory(e: ChangeEvent<HTMLSelectElement>) {
        setSelectedCategory(e.target.value);
        setSelectedLoaner(DEFAULT_LOANER);
    }

    // When Add is clicked, add the loaner to the task and clear the selection.
    function handleClick() {
        const loaner = allLoaners.find((l) => String(l.id) === selectedLoaner);
        if (!loaner) return;
        addLoaner({ ...loaner, note });
        setSelectedLoaner(DEFAULT_LOANER);
        setSelectedCategory(DEFAULT_CATEGORY);
        setNote('');
    }

    return (
        <div className="grid gap-2 sm:grid-cols-12">
            <select onChange={handleChangeCategory} value={selectedCategory} aria-label="Loaner category" className={`${inputClass} sm:col-span-4`}>
                <option disabled>{DEFAULT_CATEGORY}</option>
                {categories.map((category) => <option value={category} key={category}>{category}</option>)}
            </select>
            <select disabled={selectedCategory === DEFAULT_CATEGORY} onChange={(e) => setSelectedLoaner(e.target.value)} value={selectedLoaner} aria-label="Loaner" className={`${inputClass} sm:col-span-3`}>
                <option disabled>{DEFAULT_LOANER}</option>
                {loaners.map((loaner) => <option value={loaner.id} key={loaner.id}>{loaner.name}</option>)}
            </select>
            <input value={note} onChange={(e) => setNote(e.target.value)} maxLength={255} placeholder="Note" aria-label="Loaner note" className={`${inputClass} sm:col-span-3`} />
            <button disabled={selectedLoaner === DEFAULT_LOANER} type="button" onClick={handleClick}
                className="sm:col-span-2 text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 dark:border-blue-500 dark:text-blue-400 dark:hover:bg-blue-600 dark:hover:text-white dark:focus:ring-blue-800 disabled:opacity-40 disabled:pointer-events-none">
                Add
            </button>
        </div>
    );
}

function LoanerItem({ removeLoaner, loaner }: { removeLoaner: () => void; loaner: SelectedLoaner }) {
    return (
        <span className="inline-flex items-center gap-2 pl-3 pr-1 py-1 text-sm rounded-full border bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-200">
            {loaner.name + (loaner.note ? ` (${loaner.note})` : '')}
            <button type="button" onClick={removeLoaner} aria-label={`Remove ${loaner.name}`}
                className="w-5 h-5 inline-flex items-center justify-center rounded-full hover:bg-blue-200 dark:hover:bg-blue-800">
                <svg className="w-2.5 h-2.5" aria-hidden="true" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                </svg>
            </button>
        </span>
    );
}
