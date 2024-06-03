
import { useForm } from '@inertiajs/react'
import {useRef, useEffect} from 'react'
import { Dropdown } from 'flowbite'

export default function LoanerCard({loaner}) {
  const { data, setData, patch } = useForm({
    note: loaner.note
  })
  const dropdownEl = useRef();

  useEffect(() => {
    const targetEl = document.getElementById('dropdown'+ loaner.id)
    const triggerEl = document.getElementById('trigger'+ loaner.id)
    const options = {
      placement: 'bottom',
      triggerType: 'hover',
      delay: 200
    }
    dropdownEl.current = new Dropdown(targetEl, triggerEl, options)
  }
  , [])

  function handleOnClick() {
    console.log(data.note);
    patch(`/loaner/${loaner.id}`)
  }
  
  return (
    <>
      <a id={'trigger'+ loaner.id} className="w-28 mr-2 mb-2 block p-3 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 overflow-hidden">
          <h1 className="mb-2 text-md font-bold tracking-tight text-gray-900 dark:text-white">
          <span className="text-sm text-gray-700 dark:text-gray-400">
              {loaner.name}
          </span>
          </h1> 
          <p className="text-sm text-gray-700 dark:text-gray-400 ">{loaner.status > 0 ? ('000' + loaner.status).slice(-4) :
                                                                    loaner.note != null ? loaner.note : 'AVAILABLE' }</p>
      </a>

    <div id={'dropdown'+ loaner.id} className="z-10 hidden bg-white divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 flex h-12">
        <input value={data.note} onChange={(e) => setData('note', e.target.value)} className="my-2 ml-2 bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"></input>
        <button onClick={handleOnClick} className="focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-sm px-2 mx-2 my-2 font-medium focus:z-10 dark:hover:text-white text-white bg-green-700 hover:bg-green-800 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Save</button>
    </div>
  </>
  )
}
