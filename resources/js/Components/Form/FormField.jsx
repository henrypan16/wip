import { FormFieldDate, FormFieldTextarea, FormFieldTitle, FormFieldOption } from './index'

export default function FormField({onChange, value, type, placeholder}) {

    switch(type) {
        case 'number':
        case 'text':
            return (
                <>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{placeholder}</label>
                    <input value={value} onChange={onChange} type={type} className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder={placeholder} required={true}/>
                </>
            );
        case 'textarea':
            return (
                <>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{placeholder}</label>
                    <textarea value={value} onChange={onChange} className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder={placeholder} rows="3"/>
                </>
            )
        case 'date':
            return <FormFieldDate value={value} onChange={onChange} placeholder={placeholder}/>
        case 'option': 
            return <FormFieldOption value={value} onChange={onChange} placeholder={placeholder}/>
        case 'title':
            return (
                <div className="sm:col-span-10 relative z-0 w-full mb-6 group">
                    <input value={value} onChange={onChange} type="text" name="id" id="id" className="block pt-6 px-2.5 w-full text-lg h-14 bg-white text-gray-900 rounded-lg dark:bg-gray-700 border-0  border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required/>
                    <label htmlFor="id" className="z-30 peer-focus:font-medium absolute text-md text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 left-2.5 top-4 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:translate-x-2">{placeholder}</label>
                </div>
            )
    }

}