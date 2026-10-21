'use client';

import { useState } from 'react';
import TableData from '@/components/Table/TableData';
import TableNavigation from '@/components/Table/TableNavigation';
import TableToolbar, { checkboxClass, FilterIcon, optionLabelClass, PlusIcon, primaryButtonClass, radioClass, TableSearchBar, ToolbarDropdown } from '@/components/Table/TableToolbar';
import { LOANER_AVAILABLE, LOANER_DISCONTINUED, PAGE_SIZE } from '@/lib/constants';
import { padCustomerId } from '@/lib/format';
import type { Category, Loaner } from '@/lib/types';
import LoanerFormModal from './LoanerFormModal';

const COLUMNS = [
    { key: 'name', label: 'Name' },
    { key: 'category', label: 'Category' },
    { key: 'status', label: 'Status' },
    { key: 'note', label: 'Note' },
];

const STATUS_FILTERS = [
    { value: '', label: 'All' },
    { value: 'available', label: 'Available' },
    { value: 'used', label: 'Used' },
    { value: 'retired', label: 'Retired' },
];

function statusOf(loaner: Loaner) {
    if (loaner.status === LOANER_AVAILABLE) return 'available';
    if (loaner.status === LOANER_DISCONTINUED) return 'retired';
    return 'used';
}

function statusLabel(loaner: Loaner) {
    if (loaner.status === LOANER_AVAILABLE) return 'Available';
    if (loaner.status === LOANER_DISCONTINUED) return 'Discontinued';
    return `Loaned to ${padCustomerId(loaner.status)}`;
}

export default function LoanersTable({ loaners, categories }: { loaners: Loaner[]; categories: Category[] }) {
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [hiddenCategories, setHiddenCategories] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    // The loaner open in the form: a loaner to edit, null to add one, undefined when closed.
    const [editing, setEditing] = useState<Loaner | null | undefined>(undefined);

    const filtered = loaners.filter((loaner) =>
        loaner.name.toLowerCase().includes(search.toLowerCase())
        && (!status || statusOf(loaner) === status)
        && !hiddenCategories.includes(loaner.category));
    const lastPage = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const page = Math.min(currentPage, lastPage);
    const rows = filtered
        .slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
        .map((loaner) => ({ ...loaner, status: statusLabel(loaner) }));

    function filterBy(update: () => void) {
        update();
        setCurrentPage(1);
    }

    function toggleCategory(category: string) {
        filterBy(() => setHiddenCategories(hiddenCategories.includes(category)
            ? hiddenCategories.filter((c) => c !== category)
            : [...hiddenCategories, category]));
    }

    return (
        <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg">
            <TableToolbar search={<TableSearchBar value={search} onChange={(value) => filterBy(() => setSearch(value))} />}>
                <button type="button" onClick={() => setEditing(null)} className={primaryButtonClass}>
                    {PlusIcon}
                    Add Loaner
                </button>
                <div className="flex items-center space-x-3 w-full md:w-auto">
                    <ToolbarDropdown label="Status" title="Loaner Status">
                        {STATUS_FILTERS.map((option) => (
                            <li key={option.value} className="flex items-center">
                                <input id={`status-${option.value || 'all'}`} name="status-radio" type="radio" className={radioClass}
                                    checked={status === option.value} onChange={() => filterBy(() => setStatus(option.value))} />
                                <label htmlFor={`status-${option.value || 'all'}`} className={optionLabelClass}>{option.label}</label>
                            </li>
                        ))}
                    </ToolbarDropdown>
                    <ToolbarDropdown label="Filter" icon={FilterIcon} title="Choose category">
                        {categories.map((category) => (
                            <li key={category.id} className="flex items-center">
                                <input id={`category-${category.id}`} type="checkbox" className={checkboxClass}
                                    checked={!hiddenCategories.includes(category.name)} onChange={() => toggleCategory(category.name)} />
                                <label htmlFor={`category-${category.id}`} className={optionLabelClass}>{category.name}</label>
                            </li>
                        ))}
                    </ToolbarDropdown>
                </div>
            </TableToolbar>
            <TableData columns={COLUMNS} rows={rows} onRowClick={(row) => setEditing(loaners.find((l) => l.id === row.id))} />
            <TableNavigation total={filtered.length} pageSize={PAGE_SIZE} currentPage={page} onPage={setCurrentPage} />
            <LoanerFormModal show={editing !== undefined} loaner={editing ?? null} categories={categories} onClose={() => setEditing(undefined)} />
        </div>
    );
}
