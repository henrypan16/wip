import React from 'react'

export default function TaskCard({task, handleClick}) {
  return (
    <a onClick={() => handleClick(task.id)} href="#" className="xl:col-span-4 md:col-span-6 m-3 col-span-full block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{task.type}: {task.title}</h5>
        <p className="font-normal text-gray-700 dark:text-gray-400">{('000' + task.customer_id).slice(-4)} - {task.customer}</p>
        <p className="font-normal text-gray-700 dark:text-gray-400">Received on {task.date} by <span className="font-bold">{task.user}</span></p>
    </a>
  )
}
