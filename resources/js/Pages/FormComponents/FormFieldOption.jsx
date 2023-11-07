export default function FormFieldOption({onChange, id, colspan, type, placeholder, required, value, users}) {
    return (
        <div className={colspan}>
            <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{placeholder}</label>
            <select onChange={onChange} id={id} className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                {users.map(user =>
                    <option value={user.id} key={user.id}>
                        {user.name}
                    </option>)
                }
            </select>
        </div>
    )
}