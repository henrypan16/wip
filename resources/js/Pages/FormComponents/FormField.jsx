export default function FormField({onChange, id, colspan, type, placeholder, required, value}) {
    return (
        <div className={colspan}>
            <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{placeholder}</label>
            <input value={value} onChange={onChange} type={type} name={id} id={id} className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder={placeholder} required={required} rows="3"/>
        </div>
    );
}