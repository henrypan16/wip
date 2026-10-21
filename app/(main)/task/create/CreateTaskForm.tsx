'use client';

import { type FormEvent, useState, useTransition } from 'react';
import { createTask } from '@/actions/tasks';
import { FormField, UserSelect } from '@/components/Form';
import LoanerPicker from '@/components/LoanerPicker';
import { FormActions, FormColumn, FormColumns, FormPage, FormSection } from '@/components/TaskFormLayout';
import useCustomerLookup from '@/components/useCustomerLookup';
import { padDigits, SERVICE_ORDER_DIGITS, today } from '@/lib/format';
import type { ActionResult, Category, FormErrors, Loaner, LoanerGroupLink, User } from '@/lib/types';

type CreateTaskFormProps = { allLoaners: Loaner[]; groups: LoanerGroupLink[]; categories: Category[]; users: User[]; currentUserId: number };

export default function CreateTaskForm({ allLoaners, groups, categories, users, currentUserId }: CreateTaskFormProps) {
    const [errors, setErrors] = useState<FormErrors>({});
    const [processing, startTransition] = useTransition();
    const [data, setFormData] = useState({
        customer_id: '',
        customer_name: '',
        service_order: '',
        date: today(),
        user_id: String(currentUserId),
        equipment: '',
        problem: '',
        note: '',
        loaners: [] as Loaner[],
    });
    const setData = <K extends keyof typeof data>(key: K, value: (typeof data)[K]) => setFormData((d) => ({ ...d, [key]: value }));

    useCustomerLookup(data.customer_id, data.customer_name, (name) => setData('customer_name', name));

    function submit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        startTransition(async () => {
            const result: ActionResult | undefined = await createTask({
                ...data,
                loaners: data.loaners.map(({ id }) => id),
            });
            setErrors(result?.errors ?? {});
        });
    }

    return (
        <FormPage title="New Task" subtitle="Log equipment received for repair." onSubmit={submit}>
            <FormColumns>
                <FormColumn>
                    <FormSection title="Customer" description="Name fills in from earlier tasks">
                        <div className="sm:col-span-2">
                            <FormField id="customer_id" type="text" inputMode="numeric" value={data.customer_id} error={errors.customer_id} autoFocus
                                onChange={(e) => setData('customer_id', padDigits(e.target.value, 4))} placeholder="Customer ID" />
                        </div>
                        <div className="sm:col-span-4">
                            <FormField id="customer_name" value={data.customer_name} maxLength={50} error={errors.customer_name}
                                onChange={(e) => setData('customer_name', e.target.value)} placeholder="Pharmacy Name" />
                        </div>
                        <div className="sm:col-span-3">
                            <FormField id="service_order" type="text" inputMode="numeric" value={data.service_order} error={errors.service_order}
                                onChange={(e) => setData('service_order', padDigits(e.target.value, SERVICE_ORDER_DIGITS))} placeholder="Service Order" />
                        </div>
                        <div className="sm:col-span-3">
                            <FormField id="date" type="date" value={data.date} error={errors.date}
                                onChange={(e) => setData('date', e.target.value)} placeholder="Received" />
                        </div>
                        <div className="sm:col-span-3">
                            <UserSelect users={users} value={data.user_id} error={errors.user_id}
                                onChange={(value) => setData('user_id', value)} />
                        </div>
                    </FormSection>

                    <FormSection title="Loaners" description="Optional">
                        <div className="sm:col-span-full">
                            <LoanerPicker choices={allLoaners} selected={data.loaners} serviceOrder={data.service_order} groups={groups} categories={categories} error={errors.loaners}
                                onChange={(loaners) => setData('loaners', loaners)} />
                        </div>
                    </FormSection>
                </FormColumn>

                <FormColumn>
                    <FormSection title="Equipment">
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
                                onChange={(e) => setData('note', e.target.value)} placeholder="Note (optional)" />
                        </div>
                    </FormSection>
                </FormColumn>
            </FormColumns>

            <FormActions submitLabel="Create Task" processing={processing} />
        </FormPage>
    );
}
