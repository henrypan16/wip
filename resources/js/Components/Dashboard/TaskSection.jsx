import React from 'react'
import { useForm } from '@inertiajs/react'
import TaskCard from './TaskCard'
import {useLayoutEffect, useState} from 'react'

export default function TaskSection({tasks, title, click}) {
  return (
    <div className="grid col-span-6 p-6 grid grid-rows-6 basis-1/2">
        <h1 className="h-4 text-lg text-gray-900 dark:text-white mb-4 col-span-full row-start-1 row-end-1">{title}</h1>
        <div className="h-4 row-start-2 row-end-6 grid grid-cols-3">
            {tasks.map((task) =>
                <TaskCard key={task.id} task={task} handleClick={click}/>
            )}
            {tasks.length && <a onClick={() => {}} href="/task" className="m-1 col-span-1 block p-3 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
              <h1 className="mb-2 text-md font-bold tracking-tight text-gray-900 dark:text-white">VIEW ALL</h1>
            </a>}
        </div>
    </div>
  )
}
