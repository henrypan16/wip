import React from 'react'
import MainLayout from '../Layouts/MainLayout'

export default function TestPage() {
  return (
    <main className="p-4 md:ml-64 h-auto pt-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div
                className="border-2 border-dashed border-gray-300 rounded-lg dark:border-gray-600 h-32 md:h-64"
                ></div>
                <div
                className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-32 md:h-64"
                ></div>
                <div
                className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-32 md:h-64"
                ></div>
                <div
                className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-32 md:h-64"
                ></div>
            </div>
    </main>
  )
}