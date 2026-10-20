'use client';

import { useState } from 'react';
import { FormFieldNoLabel } from '@/components/Form';

const EMPTY_PC = {
    motherboard: '',
    cpu: '',
    ram: '',
    disk: '',
    os: '',
    motherboard_ports: '',
    gpu_ports: '',
    usb_front: '',
    usb_back: '',
};

export default function ReceiveItems({ pcList, addPc, removePc }) {
    const [pc, setPc] = useState({ id: 1, ...EMPTY_PC });
    const field = (key) => ({ id: key, value: pc[key], onChange: (e) => setPc({ ...pc, [key]: e.target.value }) });

    return (
        <div className="col-span-full grid grid-cols-2 sm:grid-cols-18">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white col-span-full">Third Party PCs</label>
            <FormFieldNoLabel {...field('motherboard')} colspan="col-span-full sm:col-span-4" placeholder="Motherboard" />
            <FormFieldNoLabel {...field('cpu')} colspan="col-span-full sm:col-span-4" placeholder="CPU" />
            <FormFieldNoLabel {...field('ram')} colspan="sm:col-span-2" placeholder="RAM" />
            <FormFieldNoLabel {...field('disk')} colspan="sm:col-span-4" placeholder="HDD" />
            <FormFieldNoLabel {...field('os')} colspan="col-span-full sm:col-span-4" placeholder="Windows" />
            <FormFieldNoLabel {...field('motherboard_ports')} colspan="col-span-full sm:col-span-6" placeholder="Motherboard Video" />
            <FormFieldNoLabel {...field('gpu_ports')} colspan="col-span-full sm:col-span-6" placeholder="GPU Ports" />
            <FormFieldNoLabel {...field('usb_front')} colspan="sm:col-span-2" placeholder="USB Front" />
            <FormFieldNoLabel {...field('usb_back')} colspan="sm:col-span-2" placeholder="USB Back" />
            <div className="sm:col-span-2">
                <button type="button" aria-label="Add PC" disabled={!pc.motherboard}
                    onClick={() => { addPc(pc); setPc({ id: pc.id + 1, ...EMPTY_PC }); }}
                    className="disabled:bg-blue-900 dark:disabled:bg-blue-900 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 rounded-lg text-sm px-4 py-2.5 mb-2 ml-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-hidden dark:focus:ring-blue-800">
                    +
                </button>
            </div>

            <div className="col-span-full">
                {pcList.map((pcItem) => (
                    <div key={pcItem.id} className="flex justify-center items-center mb-2">
                        <div className="rounded-lg border bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2 mr-2">
                            {pcItem.motherboard} / Intel(R) Core(TM) {pcItem.cpu} / {pcItem.ram} RAM / {pcItem.disk} / Windows {pcItem.os}
                        </div>
                        <button type="button" onClick={() => removePc(pcItem.id)} aria-label={`Remove ${pcItem.motherboard}`}
                            className="focus:outline-hidden text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-1 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
                            -
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
