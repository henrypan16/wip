import React from 'react'

export default function LoanerCard({loaner}) {
  return (
    <a className="mb-3 block p-3 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
        <h1 className="mb-2 text-md font-bold tracking-tight text-gray-900 dark:text-white">
        <span className="text-sm text-gray-700 dark:text-gray-400">
            {loaner.device} #{loaner.name}
        </span>
        </h1> 
        <p className="text-sm text-gray-700 dark:text-gray-400">{('000' + loaner.status).slice(-4)}</p>

    </a>
  )
}
