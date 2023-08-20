import React from 'react'

export default function TaskCard({task, handleClick}) {
  return (
    <a onClick={() => handleClick(task.id)} href="#" className="mb-3 col-span-full block p-3 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
        <h1 className="mb-2 text-md font-bold tracking-tight text-gray-900 dark:text-white">{task.title}
          <span className="text-sm text-gray-700 dark:text-gray-400">
            {task.date} by {task.user}
          </span>
        </h1> 
        <p className="text-sm text-gray-700 dark:text-gray-400">{('000' + task.customer_id).slice(-4)} - {task.customer}</p>

    </a>
  )
}
