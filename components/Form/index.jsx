// Form fields shared by the task forms. Class names follow the original
// Flowbite-styled inputs.

const inputBase = 'border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 disabled:opacity-60';

export const inputClass = `bg-white dark:bg-gray-700 ${inputBase}`;

const readOnlyInputClass = `bg-gray-100 dark:bg-gray-800 ${inputBase}`;

export const labelClass = 'block mb-2 text-sm font-medium text-gray-900 dark:text-white';

export function InputError({ message }) {
    return message ? <p className="mt-2 text-sm text-red-600 dark:text-red-500">{message}</p> : null;
}

export function FormField({ id, type = 'text', placeholder, error, required = true, ...props }) {
    if (type === 'title') return <FormFieldTitle id={id} placeholder={placeholder} error={error} {...props} />;

    return (
        <>
            <label htmlFor={id} className={labelClass}>{placeholder}</label>
            {type === 'textarea'
                ? <textarea id={id} name={id} className={inputClass} placeholder={placeholder} rows="3" {...props} />
                : <input id={id} name={id} type={type} className={props.readOnly ? readOnlyInputClass : inputClass} placeholder={placeholder} required={required} {...props} />}
            <InputError message={error} />
        </>
    );
}

// Large input with a floating label, used for the task title.
export function FormFieldTitle({ id, placeholder, error, ...props }) {
    return (
        <div className="relative z-0 w-full mb-6 group">
            <input id={id} name={id} type="text" placeholder=" " required {...props}
                className="block pt-6 px-2.5 w-full text-lg h-14 bg-white text-gray-900 rounded-lg dark:bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-hidden focus:ring-0 focus:border-blue-600 peer" />
            <label htmlFor={id} className="z-30 peer-focus:font-medium absolute text-md text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 left-2.5 top-4 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:translate-x-2">
                {placeholder}
            </label>
            <InputError message={error} />
        </div>
    );
}

export function FormFieldNoLabel({ id, colspan = '', placeholder, required = false, ...props }) {
    return (
        <div className={`${colspan} mr-2 mb-2`}>
            <input id={id} name={id} type="text" className={inputClass} placeholder={placeholder} aria-label={placeholder} required={required} {...props} />
        </div>
    );
}

export function FormFieldTextarea({ id, colspan = '', placeholder, ...props }) {
    return (
        <div className={colspan}>
            <label htmlFor={id} className={labelClass}>{placeholder}</label>
            <textarea id={id} name={id} className={inputClass} placeholder={placeholder} rows="3" {...props} />
        </div>
    );
}

export function FormFieldSelect({ id, placeholder, options, error, ...props }) {
    return (
        <>
            <label htmlFor={id} className={labelClass}>{placeholder}</label>
            <select id={id} name={id} className={inputClass} {...props}>
                {options.map((option) => <option key={option.id} value={option.id}>{option.name}</option>)}
            </select>
            <InputError message={error} />
        </>
    );
}
