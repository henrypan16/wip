'use client';

import { type FormEvent, type ReactNode, useState, useTransition } from 'react';
import { updateTask } from '@/actions/tasks';
import { FormField, InputError, UserSelect } from '@/components/Form';
import LoanerPicker from '@/components/LoanerPicker';
import { STATUS } from '@/lib/constants';
import { formatDate, padCustomerId, padDigits, SERVICE_ORDER_DIGITS } from '@/lib/format';
import type { ActionResult, Category, FormErrors, Loaner, LoanerGroupLink, Status, Task, User } from '@/lib/types';
import StatusBadge, { DEFAULT_STATUS_COLOR, STATUS_COLORS, statusName } from '@/components/StatusBadge';
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
    /** The loaners linked to the task now. */
    taskLoaners: Loaner[];
    /** Every loaner in service, to choose from. */
    loaners: Loaner[];
    groups: LoanerGroupLink[];
    categories: Category[];
};

export default function UpdateTaskForm({ task, status, users, taskLoaners, loaners, groups, categories }: UpdateTaskFormProps) {
    const [errors, setErrors] = useState<FormErrors>({});
    const [processing, startTransition] = useTransition();
    const [data, setFormData] = useState({
        equipment: task.equipment ?? '',
        problem: task.problem ?? '',
        note: task.note ?? '',
        status_id: task.status_id,
        service_order: task.service_order ?? '',
        user_id: task.user_id ? String(task.user_id) : '',
        loaners: taskLoaners,
    });
    const setData = <K extends keyof typeof data>(key: K, value: (typeof data)[K]) => setFormData((d) => ({ ...d, [key]: value }));
    // A completed task is closed: everything but the note is shown read-only (the server enforces this too).
    const locked = task.status_id === STATUS.COMPLETE;
    const statusLabel = status.find((s) => String(s.id) === String(task.status_id))?.name;

    function submit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        startTransition(async () => {
            const result: ActionResult | undefined = await updateTask(task.id, {
                ...data,
                loaners: data.loaners.map(({ id }) => id),
            });
            setErrors(result?.errors ?? {});
        });
    }

    return (
        <FormPage title="Edit Task" subtitle={<><span className="font-mono">{padCustomerId(task.customer_id)}</span> · {task.customer_name}</>} onSubmit={submit}>
            {locked && (
                <p className="px-5 py-3 text-sm rounded-t-xl border-b bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-700/50 dark:text-gray-300 dark:border-gray-700">
                    This task is complete. Only the note can be changed.
                </p>
            )}
            <FormColumns>
                <FormColumn>
                    <FormSection title="Details">
                        {locked ? (
                            <dl className="sm:col-span-full grid grid-cols-2 sm:grid-cols-3 gap-3">
                                <Summary label="Service Order">{task.service_order && `SO#${task.service_order}`}</Summary>
                                <Summary label="Received By">{task.user}</Summary>
                                <Summary label="Received">{formatDate(task.date)}</Summary>
                            </dl>
                        ) : (<>
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
                        </>)}
                    </FormSection>

                    <FormSection title="Loaners" description={locked ? undefined : 'Removed loaners go back to the pool'}>
                        <div className="sm:col-span-full">
                            {locked ? (
                                <p className="text-sm text-gray-900 dark:text-white">{taskLoaners.map((loaner) => loaner.name).join(', ') || '—'}</p>
                            ) : (
                                <LoanerPicker choices={loaners} selected={data.loaners} serviceOrder={data.service_order} groups={groups} categories={categories} error={errors.loaners}
                                    onChange={(loaners) => setData('loaners', loaners)} />
                            )}
                        </div>
                    </FormSection>

                    <FormSection title="Status">
                        {locked ? (
                            <div className="sm:col-span-full"><StatusBadge id={task.status_id} label={statusLabel} /></div>
                        ) : (
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
                        )}
                    </FormSection>
                </FormColumn>

                <FormColumn>
                    <FormSection title="Equipment">
                        <div className="sm:col-span-full">
                            <FormField id="equipment" value={data.equipment} maxLength={60} error={errors.equipment} readOnly={locked}
                                onChange={(e) => setData('equipment', e.target.value)} placeholder="Equipment" />
                        </div>
                        <div className="sm:col-span-full">
                            <FormField id="problem" value={data.problem} maxLength={60} error={errors.problem} readOnly={locked}
                                onChange={(e) => setData('problem', e.target.value)} placeholder="Problem" />
                        </div>
                        <div className="sm:col-span-full">
                            <FormField id="note" type="textarea" value={data.note} maxLength={255} error={errors.note}
                                onChange={(e) => setData('note', e.target.value)} placeholder="Note (optional)" />
                        </div>
                    </FormSection>
                </FormColumn>
            </FormColumns>

            <FormActions submitLabel={locked ? 'Save Note' : 'Save Changes'} processing={processing} />
        </FormPage>
    );
}
