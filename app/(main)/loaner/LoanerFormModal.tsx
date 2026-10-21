'use client';

import { type FormEvent, useState, useTransition } from 'react';
import { createLoaner, updateLoaner } from '@/actions/loaners';
import CloseButton from '@/components/CloseButton';
import { FormField, InputError, inputClass, labelClass } from '@/components/Form';
import Modal from '@/components/Modal';
import { primaryButtonClass, secondaryButtonClass } from '@/components/Page';
import { loanerServiceOrder, loanerState, padDigits, SERVICE_ORDER_DIGITS } from '@/lib/format';
import { loanerGroups } from '@/lib/loanerGroups';
import type { ActionResult, Category, FormErrors, Loaner, LoanerGroupLink } from '@/lib/types';

/** `loaner` is the loaner being edited, or null to create one. `loaners` and `groups` are for choosing its main item. */
type LoanerFormModalProps = {
    show: boolean;
    loaner: Loaner | null;
    categories: Category[];
    loaners: Loaner[];
    groups: LoanerGroupLink[];
    onClose: () => void;
};

export default function LoanerFormModal({ show, onClose, ...props }: LoanerFormModalProps) {
    return (
        <Modal show={show} onClose={onClose} className="max-w-lg">
            {/* Keyed so the fields reset whenever a different loaner is opened. */}
            {show && <LoanerForm key={props.loaner?.id ?? 'new'} {...props} onClose={onClose} />}
        </Modal>
    );
}

function LoanerForm({ loaner, categories, loaners, groups, onClose }: Omit<LoanerFormModalProps, 'show'>) {
    const { accessoriesOf, mainOf } = loanerGroups(groups);
    // A main item's own accessories, when this loaner is one; it can't then be an accessory itself.
    const ownAccessories = loaner ? (accessoriesOf.get(loaner.id) ?? []).map((id) => loaners.find((l) => l.id === id)?.name).filter(Boolean) : [];
    // Any loaner can be a main item except this one and loaners that are accessories themselves.
    const mains = loaners.filter((l) => l.id !== loaner?.id && !mainOf.has(l.id));
    const [data, setFormData] = useState({
        name: loaner?.name ?? '',
        category_id: String(loaner?.category_id ?? categories.find((c) => c.active)?.id ?? ''),
        state: loaner ? loanerState(loaner) : 'available',
        service_order: loaner ? loanerServiceOrder(loaner) : '',
        main_id: String((loaner && mainOf.get(loaner.id)) ?? ''),
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [processing, startTransition] = useTransition();
    const setData = (key: keyof typeof data, value: string) => setFormData((d) => ({ ...d, [key]: value }));

    // Saved as the loaner's status: blank, the SO# it is out with, or discontinued.
    const states = [
        { value: 'available', label: 'Available' },
        { value: 'used', label: 'In use' },
        { value: 'discontinued', label: 'Discontinued' },
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
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label htmlFor="state" className={labelClass}>Status</label>
                        <select id="state" className={inputClass} value={data.state} onChange={(e) => setData('state', e.target.value)}>
                            {states.map((state) => <option key={state.value} value={state.value}>{state.label}</option>)}
                        </select>
                        <InputError message={errors.state} />
                    </div>
                    {data.state === 'used' && (
                        <div>
                            <FormField id="service_order" inputMode="numeric" placeholder="Service Order" value={data.service_order} error={errors.service_order}
                                onChange={(e) => setData('service_order', padDigits(e.target.value, SERVICE_ORDER_DIGITS))} />
                        </div>
                    )}
                </div>
                <div>
                    <label htmlFor="main_id" className={labelClass}>Accessory of</label>
                    {ownAccessories.length > 0 ? (
                        <p className="text-sm text-gray-600 dark:text-gray-300">Main item of a group with {ownAccessories.join(', ')}.</p>
                    ) : (
                        <select id="main_id" className={inputClass} value={data.main_id} onChange={(e) => setData('main_id', e.target.value)}>
                            <option value="">None (goes out on its own)</option>
                            {categories.map((category) => {
                                const options = mains.filter((l) => l.category_id === category.id);
                                return options.length > 0 && (
                                    <optgroup key={category.id} label={category.name}>
                                        {options.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
                                    </optgroup>
                                );
                            })}
                        </select>
                    )}
                    <InputError message={errors.main_id} />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                    <button type="button" onClick={onClose} className={secondaryButtonClass}>Cancel</button>
                    <button type="submit" disabled={processing} className={primaryButtonClass}>
                        {loaner ? 'Save' : 'Add Loaner'}
                    </button>
                </div>
            </form>
        </div>
    );
}
