// Form fields shared by the task forms. Class names follow the original
// Flowbite-styled inputs.

import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import type { User } from '@/lib/types';

const inputBase = 'border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 disabled:opacity-60';

export const inputClass = `bg-white dark:bg-gray-700 ${inputBase}`;

const readOnlyInputClass = `bg-gray-100 dark:bg-gray-800 ${inputBase}`;

export const labelClass = 'block mb-2 text-sm font-medium text-gray-900 dark:text-white';

export function InputError({ message }: { message?: string | null }) {
    return message ? <p className="mt-2 text-sm text-red-600 dark:text-red-500">{message}</p> : null;
}

type FieldProps = InputHTMLAttributes<HTMLInputElement> & { id: string; placeholder: string; error?: string };

/** A labelled input, or a textarea when `type` is 'textarea'. */
export function FormField({ id, type = 'text', placeholder, error, required = true, ...props }: FieldProps) {
    return (
        <>
            <label htmlFor={id} className={labelClass}>{placeholder}</label>
            {type === 'textarea'
                ? <textarea id={id} name={id} className={inputClass} placeholder={placeholder} rows={3} {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)} />
                : <input id={id} name={id} type={type} className={props.readOnly ? readOnlyInputClass : inputClass} placeholder={placeholder} required={required} {...props} />}
            <InputError message={error} />
        </>
    );
}

type ColumnFieldProps = { id: string; placeholder: string; colspan?: string };

export function FormFieldNoLabel({ id, colspan = '', placeholder, required = false, ...props }: ColumnFieldProps & InputHTMLAttributes<HTMLInputElement>) {
    return (
        <div className={`${colspan} mr-2 mb-2`}>
            <input id={id} name={id} type="text" className={inputClass} placeholder={placeholder} aria-label={placeholder} required={required} {...props} />
        </div>
    );
}

export function FormFieldTextarea({ id, colspan = '', placeholder, ...props }: ColumnFieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return (
        <div className={colspan}>
            <label htmlFor={id} className={labelClass}>{placeholder}</label>
            <textarea id={id} name={id} className={inputClass} placeholder={placeholder} rows={3} {...props} />
        </div>
    );
}

/** Who received a task. `placeholder` is the blank first option, when blank is allowed. */
export function UserSelect({ users, value, onChange, error, placeholder }: {
    users: User[];
    value: string;
    onChange: (value: string) => void;
    error?: string;
    placeholder?: string;
}) {
    return (
        <>
            <label htmlFor="user_id" className={labelClass}>Received By</label>
            <select id="user_id" className={inputClass} value={value} onChange={(e) => onChange(e.target.value)} required={placeholder === undefined}>
                {placeholder !== undefined && <option value="">{placeholder}</option>}
                {users.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}
            </select>
            <InputError message={error} />
        </>
    );
}
