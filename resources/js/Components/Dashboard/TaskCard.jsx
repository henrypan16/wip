

export default function TaskCard({task, handleClick}) {
  return (
    <a onClick={() => handleClick(task.id)} href="#" className="m-1 block p-3 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 basis-1/4 min-w-40 h-18 grow">
        <h1 className="mb-2 text-md font-bold tracking-tight text-gray-900 dark:text-white">{task.title}</h1>
        <p className="text-sm text-gray-700 dark:text-gray-400">SO#{task.service_order} - {('000' + task.customer_id).slice(-4)}</p>
        <p className="text-sm text-gray-700 dark:text-gray-400"></p>

    </a>
  )
}
