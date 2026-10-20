import Link from 'next/link';
import TaskCard from './TaskCard';

export default function TaskSection({ tasks, title, click, slots }) {
    return (
        <div className="flex flex-col mr-8 mt-8 w-full">
            <h1 className="text-lg text-gray-900 dark:text-white">{title}</h1>
            <div className="pt-2 flex flex-wrap">
                {tasks.map((task) => <TaskCard key={task.id} task={task} handleClick={click} />)}
                {[...Array(Math.max(0, slots - tasks.length))].map((_, i) => (
                    <div key={i} className="basis-1/4 grow min-w-40 m-1 h-20 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 flex">
                        <h1 className="m-auto text-sm font-thin tracking-tight text-gray-900 dark:text-gray-600 select-none">Empty</h1>
                    </div>
                ))}
                <Link href="/task" className="basis-1/4 grow min-w-40 m-1 h-18 p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 flex">
                    <h1 className="m-auto text-md font-bold tracking-tight text-gray-900 dark:text-white">VIEW ALL</h1>
                </Link>
            </div>
        </div>
    );
}
