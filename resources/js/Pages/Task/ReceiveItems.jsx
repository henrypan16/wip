import React from 'react'
import { FormFieldNoLabel } from '../FormComponents'
import { useState } from 'react'

export default function ReceiveItems() {
    const [pc, setPc] = useState({
        id: 1,
        motherboard: '',
        cpu: '',
        ram: '',
        disk: '',
        os: '',
    })

    const [pcList, setPcList] = useState([]);

    function addPc() {
        setPcList([...pcList, pc]);
        setPc({...pc, id: pc.id + 1});
    }

    function removePc(id) {
        setPcList(pcList.filter(pcItem => pcItem.id != id));
    }

  return (
    <div className="col-span-full grid grid-cols-18">
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white col-span-full">Third Party PCs</label>
        <FormFieldNoLabel onChange={e => setPc({...pc, motherboard: e.target.value })} id="motherboard" colspan="sm:col-span-4" type="text" placeholder="Motherboard" required={true} value={pc.motherboard}/>
        <FormFieldNoLabel onChange={e => setPc({...pc, cpu: e.target.value })} id="cpu" colspan="sm:col-span-4" type="text" placeholder="CPU" required={true} value={pc.cpu}/>
        <FormFieldNoLabel onChange={e => setPc({...pc, ram: e.target.value })} id="ram" colspan="sm:col-span-2" type="text" placeholder="RAM" required={true} value={pc.ram}/>
        <FormFieldNoLabel onChange={e => setPc({...pc, disk: e.target.value })} id="disk" colspan="sm:col-span-4" type="text" placeholder="HDD" required={true} value={pc.disk}/>
        <FormFieldNoLabel onChange={e => setPc({...pc, os: e.target.value })} id="os" colspan="sm:col-span-2" type="text" placeholder="Windows" required={true} value={pc.os}/>

        <div className="sm:col-span-2">
                <button type="button" onClick={addPc} className="dark:disabled:bg-blue-900 disabled:bg-blue-900 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 rounded-lg text-sm px-4 py-2.5 mb-2 ml-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">+</button>
        </div>

        <div className="col-span-full">
            {pcList.map((pcItem) => 
                <div key={pcItem.id} className="flex justify-center items-center mb-2">
                    <div className="rounded-lg border bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2 mr-2">
                    {pcItem.motherboard} / Intel(R) Core(TM) {pcItem.cpu} / {pcItem.ram} RAM / {pcItem.disk} / Windows {pcItem.os}
                    </div>
                    <button type="button" onClick={() => {removePc(pcItem.id)}} className="h-1/2 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-1 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">-</button>
                </div>

            )}
        </div>
    </div>
  )
}
