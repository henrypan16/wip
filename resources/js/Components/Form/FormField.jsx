import { FormFieldDate, FormFieldTextarea, FormFieldTitle, FormFieldOption } from './index'

export default function FormField({onChange, formfields}) {

    switch(formfields.type) {
        case 'number':
        case 'text':
            return (
                <div className={formfields.colspan}>
                    <label htmlFor={formfields.id} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{formfields.placeholder}</label>
                    <input value={formfields.value} onChange={onChange} type={formfields.type} name={formfields.id} id={formfields.id} className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder={formfields.placeholder} required={formfields.required}/>
                </div>
            );
        case 'textarea':
            return <FormFieldTextarea onChange={onChange} id="note" colspan="sm:col-span-full" type="textarea" placeholder="Note" required={true} value={formfields.value}/>  
        case 'date':
            return <FormFieldDate value={date} id="date" colspan="sm:col-span-4" onChange={onChange} placeholder="Receive Date"/>
        case 'option': 
    }

}