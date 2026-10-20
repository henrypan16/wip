'use client';

import { useState } from 'react';
import { FormFieldNoLabel, inputClass } from '@/components/Form';

const DEFAULT_CATEGORY = 'Select category';
const DEFAULT_LOANER = 'Select loaner';

export default function LoanerSelection({ addLoaner, allLoaners }) {
    const [isChecked, setIsChecked] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(DEFAULT_CATEGORY);
    const [selectedLoaner, setSelectedLoaner] = useState(DEFAULT_LOANER);
    const [note, setNote] = useState('');

    // Categories that still have an available loaner.
    const categories = [...new Set(allLoaners.map((item) => item.category))];
    const loaners = allLoaners.filter((x) => x.category === selectedCategory);

    function handleChangeCategory(e) {
        setSelectedCategory(e.target.value);
        setSelectedLoaner(DEFAULT_LOANER);
    }

    // When + is clicked, add the loaner to the task and clear the selection.
    function handleClick() {
        addLoaner({ ...allLoaners.find((loaner) => String(loaner.id) === selectedLoaner), note });
        setSelectedLoaner(DEFAULT_LOANER);
        setSelectedCategory(DEFAULT_CATEGORY);
        setNote('');
    }

    return (
        <>
            <div className="col-span-full sm:col-span-1 flex items-center">
                <input type="checkbox" checked={isChecked} onChange={() => setIsChecked(!isChecked)} id="loaner-check"
                    className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                <label htmlFor="loaner-check" className="items-center ml-2 text-sm font-medium text-gray-900 dark:text-white">Loaner</label>
            </div>
            <div className="col-span-full sm:col-span-3">
                <select disabled={!isChecked} onChange={handleChangeCategory} value={selectedCategory} aria-label="Loaner category" className={inputClass}>
                    <option disabled>{DEFAULT_CATEGORY}</option>
                    {categories.map((category) => <option value={category} key={category}>{category}</option>)}
                </select>
            </div>
            <div className="col-span-full sm:col-span-4">
                <select disabled={!isChecked} onChange={(e) => setSelectedLoaner(e.target.value)} value={selectedLoaner} aria-label="Loaner" className={inputClass}>
                    <option disabled>{DEFAULT_LOANER}</option>
                    {loaners.map((loaner) => <option value={loaner.id} key={loaner.id}>{loaner.name}</option>)}
                </select>
            </div>
            <FormFieldNoLabel value={note} onChange={(e) => setNote(e.target.value)} id="loaner-note" colspan="col-span-full sm:col-span-3" placeholder="Note" maxLength={255} disabled={!isChecked} />
            <div className="col-span-full sm:col-span-1">
                <button disabled={!isChecked || selectedLoaner === DEFAULT_LOANER} type="button" onClick={handleClick} aria-label="Add loaner"
                    className="disabled:bg-blue-900 dark:disabled:bg-blue-900 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 rounded-lg text-sm px-4 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-hidden dark:focus:ring-blue-800">
                    +
                </button>
            </div>
        </>
    );
}
