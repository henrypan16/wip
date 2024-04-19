import React from 'react'
import { useForm } from '@inertiajs/react'
import LoanerCard from './LoanerCard'

export default function LoanerSection({loaners, title}) {  
  return (
    <div className="flex-wrap basis-1/4">
        <h3 className="text-sm text-gray-900 dark:text-white my-4">{title}</h3>
        <div className="flex flex-wrap">
            {loaners.map((loaner) => <LoanerCard key={loaner.id} loaner={loaner}/>)}        
        </div>
    </div>
  )
}
