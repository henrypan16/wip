'use client';

import { type FormEvent, useState, useTransition } from 'react';
import { createLoaner, updateLoaner } from '@/actions/loaners';
import CloseButton from '@/components/CloseButton';
import { FormField, InputError, inputClass, labelClass } from '@/components/Form';
import Modal from '@/components/Modal';
import { primaryButtonClass, toolbarButtonClass } from '@/components/Table/TableToolbar';
import { LOANER_AVAILABLE, LOANER_DISCONTINUED } from '@/lib/constants';
import { padCustomerId } from '@/lib/format';
import type { ActionResult, Category, FormErrors, Loaner } from '@/lib/types';

/** `loaner` is the loaner being edited, or null to create one. */
type LoanerFormModalProps = { show: boolean; loaner: Loaner | null; categories: Category[]; onClose: () => void };

export default function LoanerFormModal({ show, loaner, categories, onClose }: LoanerFormModalProps) {
    return (
        <Modal show={show} onClose={onClose} className="max-w-lg">
            {/* Keyed so the fields reset whenever a different loaner is opened. */}
            {show && <LoanerForm key={loaner?.id ?? 'new'} loaner={loaner} categories={categories} onClose={onClose} />}
        </Modal>
    );
}

function LoanerForm({ loaner, categories, onClose }: Omit<LoanerFormModalProps, 'show'>) {
    const [data, setFormData] = useState({
        name: loaner?.name ?? '',
        category_id: String(loaner?.category_id ?? categories.find((c) => c.active)?.id ?? ''),
        status: loaner?.status ?? LOANER_AVAILABLE,
        note: loaner?.note ?? '',
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [processing, startTransition] = useTransition();
    const setData = (key: keyof typeof data, value: string) => setFormData((d) => ({ ...d, [key]: value }));

    // A loaner out with a customer can only stay with them or be discontinued;
    // it is returned to the pool by completing its task.
    const loanedTo = loaner && loaner.status !== LOANER_AVAILABLE && loaner.status !== LOANER_DISCONTINUED ? loaner.status : null;
    const statuses = [
        loanedTo ? { value: loanedTo, label: `Loaned to ${padCustomerId(loanedTo)}` } : { value: LOANER_AVAILABLE, label: 'Available' },
        { value: LOANER_DISCONTINUED, label: 'Discontinued' },
    ];

    function submit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        startTransition(async () => {
            const result: ActionResult | undefined = loaner ? await updateLoaner(loaner.id, data) : await createLoaner(data);
            setErrors(result?.errors ?? {});
            if (result?.saved) onClose();
        });
    }

    return (
        <div className="relative bg-white rounded-xl shadow-lg dark:bg-gray-700">
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-200 dark:border-gray-600">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{loaner ? 'Edit Loaner' : 'Add Loaner'}</h3>
                <CloseButton onClick={onClose} />
            </div>
            <form onSubmit={submit} className="px-5 py-5 space-y-4">
                <div>
                    <FormField id="name" placeholder="Name" value={data.name} onChange={(e) => setData('name', e.target.value)} maxLength={255} autoFocus error={errors.name} />
                </div>
                <div>
                    <label htmlFor="category_id" className={labelClass}>Category</label>
                    <select id="category_id" className={inputClass} value={data.category_id} onChange={(e) => setData('category_id', e.target.value)} required>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>{category.name}{category.active ? '' : ' (inactive)'}</option>
                        ))}
                    </select>
                    <InputError message={errors.category_id} />
                </div>
                <div>
                    <label htmlFor="status" className={labelClass}>Status</label>
                    <select id="status" className={inputClass} value={data.status} onChange={(e) => setData('status', e.target.value)}>
                        {statuses.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}
                    </select>
                    <InputError message={errors.status} />
                </div>
                <div>
                    <FormField id="note" type="textarea" placeholder="Note" value={data.note} onChange={(e) => setData('note', e.target.value)} maxLength={255} required={false} error={errors.note} />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                    <button type="button" onClick={onClose} className={toolbarButtonClass}>Cancel</button>
                    <button type="submit" disabled={processing} className={`${primaryButtonClass} disabled:opacity-60`}>
                        {loaner ? 'Save' : 'Add Loaner'}
                    </button>
                </div>
            </form>
        </div>
    );
}
