export default function LoanerItem({removeLoaner, loaner}) {
    return (
        <div key={loaner.id} className="flex justify-center items-center p-2 rounded-lg mr-3 mb-3 border bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" controlid="Loaner">
            <div className="mr-2 dark:text-white">{loaner.name + (loaner.note != '' ? " (" + loaner.note + ")" : '')}</div>
            <button type="button" onClick={() => removeLoaner(loaner)} className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-1 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">-</button>
        </div>
    );
}