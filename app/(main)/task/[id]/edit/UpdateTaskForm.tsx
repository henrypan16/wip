'use client';

import { type FormEvent, type ReactNode, useState, useTransition } from 'react';
import { updateTask } from '@/actions/tasks';
import { FormField, InputError, UserSelect } from '@/components/Form';
import LoanerPicker, { type SelectedLoaner } from '@/components/LoanerPicker';
import { formatDate, padCustomerId, padDigits, SERVICE_ORDER_DIGITS } from '@/lib/format';
import type { ActionResult, FormErrors, Loaner, Status, Task, User } from '@/lib/types';
import { DEFAULT_STATUS_COLOR, STATUS_COLORS, statusName } from '@/components/StatusBadge';
import { FormActions, FormColumn, FormColumns, FormPage, FormSection } from '@/components/TaskFormLayout';

function Summary({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">{label}</dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white">{children || '—'}</dd>
        </div>
    );
}

type UpdateTaskFormProps = {
    task: Task;
    status: Status[];
    users: User[];
    /** The loaners linked to the task now, with the notes they were lent with. */
    taskLoaners: Loaner[];
    /** Loaners free to be added. */
    availableLoaners: Loaner[];
};

export default function UpdateTaskForm({ task, status, users, taskLoaners, availableLoaners }: UpdateTaskFormProps) {
    const [errors, setErrors] = useState<FormErrors>({});
    const [processing, startTransition] = useTransition();
    const [data, setFormData] = useState({
        equipment: task.equipment ?? '',
        problem: task.problem ?? '',
        note: task.note ?? '',
        status_id: task.status_id,
        service_order: task.service_order ?? '',
        user_id: task.user_id ? String(task.user_id) : '',
        loaners: taskLoaners.map((loaner) => ({ ...loaner, note: loaner.note ?? '' })) as SelectedLoaner[],
    });
    // The task's own loaners stay choosable, so one removed by mistake can be added back.
    const choices = [...taskLoaners, ...availableLoaners.filter((a) => !taskLoaners.some((t) => t.id === a.id))];
    const setData = <K extends keyof typeof data>(key: K, value: (typeof data)[K]) => setFormData((d) => ({ ...d, [key]: value }));

    function submit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        startTransition(async () => {
            const result: ActionResult | undefined = await updateTask(task.id, {
                ...data,
                loaners: data.loaners.map(({ id, note }) => ({ id, note })),
            });
            setErrors(result?.errors ?? {});
        });
    }

    return (
        <FormPage title="Edit Task" subtitle={<><span className="font-mono">{padCustomerId(task.customer_id)}</span> · {task.customer_name}</>} onSubmit={submit}>
            <FormColumns>
                <FormColumn>
                    <FormSection title="Details">
                        <div className="sm:col-span-3">
                            <FormField id="service_order" type="text" inputMode="numeric" value={data.service_order} error={errors.service_order}
                                onChange={(e) => setData('service_order', padDigits(e.target.value, SERVICE_ORDER_DIGITS))} placeholder="Service Order" />
                        </div>
                        <div className="sm:col-span-3">
                            <UserSelect users={users} value={data.user_id} error={errors.user_id} placeholder="Not recorded"
                                onChange={(value) => setData('user_id', value)} />
                        </div>
                        <dl className="sm:col-span-full">
                            <Summary label="Received">{formatDate(task.date)}</Summary>
                        </dl>
                    </FormSection>

                    <FormSection title="Loaners" description="Removed loaners go back to the pool">
                        <div className="sm:col-span-full">
                            <LoanerPicker choices={choices} selected={data.loaners} error={errors.loaners}
                                onChange={(loaners) => setData('loaners', loaners)} />
                        </div>
                    </FormSection>

                    <FormSection title="Status">
                        <div className="sm:col-span-full" role="radiogroup" aria-label="Status">
                            <div className="flex flex-wrap gap-2">
                                {status.map((option) => {
                                    const id = String(option.id);
                                    const checked = id === String(data.status_id);
                                    return (
                                        <label key={id} className={`cursor-pointer px-3 py-1.5 text-sm font-medium rounded-full border transition ${checked
                                            ? `${STATUS_COLORS[id] ?? DEFAULT_STATUS_COLOR} border-transparent ring-2 ring-offset-1 ring-current dark:ring-offset-gray-800`
                                            : 'border-gray-300 text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'}`}>
                                            <input type="radio" name="status_id" value={id} checked={checked} onChange={() => setData('status_id', id)} className="sr-only" />
                                            {statusName(option.name)}
                                        </label>
                                    );
                                })}
                            </div>
                            <InputError message={errors.status_id} />
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

            <FormActions submitLabel="Save Changes" processing={processing} />
        </FormPage>
    );
}
