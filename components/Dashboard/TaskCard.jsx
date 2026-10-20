import { padCustomerId } from '@/lib/format';

export default function TaskCard({ task, handleClick }) {
    return (
        <button type="button" onClick={() => handleClick(task.id)} className="text-left m-1 block p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 basis-1/4 min-w-40 h-18 grow overflow-hidden">
            <h1 className="mb-2 text-md font-bold tracking-tight text-gray-900 dark:text-white truncate">{task.title || task.equipment}</h1>
            <p className="text-sm text-gray-700 dark:text-gray-400 truncate">
                {task.service_order ? `SO#${task.service_order} - ` : ''}{padCustomerId(task.customer_id)}
            </p>
        </button>
    );
}
