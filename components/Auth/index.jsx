// Inputs and buttons for the login, registration and profile pages,
// matching the Laravel Breeze components the app used before.

export function InputLabel({ htmlFor, value, className = '' }) {
    return <label htmlFor={htmlFor} className={`block font-medium text-sm text-gray-700 dark:text-gray-300 ${className}`}>{value}</label>;
}

export function TextInput({ className = '', ...props }) {
    return (
        <input type="text" {...props}
            className={`border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-xs ${className}`} />
    );
}

export function InputError({ message, className = '' }) {
    return message ? <p className={`text-sm text-red-600 dark:text-red-400 ${className}`}>{message}</p> : null;
}

export function Checkbox(props) {
    return <input type="checkbox" {...props} className="rounded-sm dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-indigo-600 shadow-xs focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:focus:ring-offset-gray-800" />;
}

const buttonBase = 'inline-flex items-center px-4 py-2 border rounded-md font-semibold text-xs uppercase tracking-widest focus:outline-hidden focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150 disabled:opacity-25';

export function PrimaryButton({ className = '', ...props }) {
    return <button {...props} className={`${buttonBase} bg-gray-800 dark:bg-gray-200 border-transparent text-white dark:text-gray-800 hover:bg-gray-700 dark:hover:bg-white focus:bg-gray-700 dark:focus:bg-white active:bg-gray-900 dark:active:bg-gray-300 focus:ring-indigo-500 ${className}`} />;
}

export function SecondaryButton({ className = '', type = 'button', ...props }) {
    return <button type={type} {...props} className={`${buttonBase} bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-300 shadow-xs hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-indigo-500 ${className}`} />;
}

export function DangerButton({ className = '', ...props }) {
    return <button {...props} className={`${buttonBase} bg-red-600 border-transparent text-white hover:bg-red-500 active:bg-red-700 focus:ring-red-500 ${className}`} />;
}

export const linkClass = 'underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800';
