'use client';

import { useCallback, useState } from 'react';
import CloseButton from '@/components/CloseButton';
import { FormField, FormFieldTextarea, inputClass, labelClass } from '@/components/Form';
import Modal from '@/components/Modal';
import { formatDate, today } from '@/lib/format';
import ReceiveItems from './ReceiveItems';
import useCustomerLookup from './useCustomerLookup';

// Builds the inspection log text for third-party PCs dropped off by a pharmacy.
// Nothing is saved; the log is shown so it can be copied.
export default function ReceiveForm() {
    const [isProspect, setIsProspect] = useState(false);
    const [showLog, setShowLog] = useState(false);
    const [pcList, setPcList] = useState([]);
    const [data, setFormData] = useState({
        customer_id: '',
        pharmacy: '',
        dropoff_date: today(),
        inspect_date: today(),
        contact_number: '',
        contact_person: '',
        dropoff_person: '',
        note: '',
    });
    const setData = (key, value) => setFormData((d) => ({ ...d, [key]: value }));
    const closeLog = useCallback(() => setShowLog(false), []);

    useCustomerLookup(data.customer_id, data.pharmacy, (name) => setData('pharmacy', name));

    const addPc = (pc) => setPcList([...pcList, pc]);
    const removePc = (id) => setPcList(pcList.filter((pcItem) => pcItem.id !== id));

    return (
        <div className="dark:bg-gray-900 px-5 sm:px-10 md:px-5 lg:px-32 2xl:px-80 pt-12">
            <form onSubmit={(e) => { e.preventDefault(); setShowLog(true); }}>
                <div className="grid gap-4 mb-4 sm:grid-cols-18">
                    <div className="sm:col-span-full mb-6 flex items-center">
                        <span className="text-3xl font-bold dark:text-white">Receive 3rd Party Items</span>
                    </div>

                    {/* Customer ID with a "Prospect" checkbox for pharmacies that are not customers yet. */}
                    <div className="sm:col-span-4">
                        <div className={`${labelClass} flex items-center`}>
                            <input type="checkbox" checked={isProspect} onChange={() => setIsProspect(!isProspect)} id="prospect"
                                className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                            <label htmlFor="prospect" className="ml-2">Prospect</label>
                        </div>
                        <input value={data.customer_id} onChange={(e) => setData('customer_id', e.target.value.replace(/\D/g, '').slice(0, 4))}
                            inputMode="numeric" id="customer_id" aria-label="Customer ID" className={inputClass} placeholder="Customer ID" required={!isProspect} disabled={isProspect} />
                    </div>
                    <div className="sm:col-span-7">
                        <FormField id="dropoff_date" type="date" value={data.dropoff_date} onChange={(e) => setData('dropoff_date', e.target.value)} placeholder="Dropoff Date" />
                    </div>
                    <div className="sm:col-span-7">
                        <FormField id="inspect_date" type="date" value={data.inspect_date} onChange={(e) => setData('inspect_date', e.target.value)} placeholder="Inspect Date" />
                    </div>
                    <div className="sm:col-span-full">
                        <FormField id="pharmacy" value={data.pharmacy} onChange={(e) => setData('pharmacy', e.target.value)} placeholder="Pharmacy's Name" />
                    </div>
                    <div className="sm:col-span-6">
                        <FormField id="dropoff_person" value={data.dropoff_person} onChange={(e) => setData('dropoff_person', e.target.value.toUpperCase())} placeholder="Dropoff Person" />
                    </div>
                    <div className="sm:col-span-6">
                        <FormField id="contact_person" value={data.contact_person} onChange={(e) => setData('contact_person', e.target.value.toUpperCase())} placeholder="Contact Person" />
                    </div>
                    <div className="sm:col-span-6">
                        <FormField id="contact_number" type="tel" value={data.contact_number} onChange={(e) => setData('contact_number', e.target.value)} placeholder="Contact Number" />
                    </div>
                    <ReceiveItems pcList={pcList} addPc={addPc} removePc={removePc} />
                    <FormFieldTextarea id="note" colspan="sm:col-span-full" placeholder="Note" value={data.note} onChange={(e) => setData('note', e.target.value)} />
                </div>
                <button type="submit" className="inline-flex focus:outline-hidden text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                    <svg className="mr-1 -ml-1 w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path></svg>
                    Generate Log
                </button>
            </form>

            <Modal show={showLog} onClose={closeLog}>
                <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
                    <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                        <CloseButton onClick={closeLog} />
                    </div>
                    <div className="p-6 space-y-4 text-base leading-relaxed text-gray-500 dark:text-gray-400 select-text">
                        <p>
                            INSPECTION: I received a Third Party PC dropped off by {data.dropoff_person} for inspection and configuration.
                            The specification of the PC is as follows.
                        </p>
                        {pcList.map((pc) => (
                            <p key={pc.id}>#{pc.motherboard} / Intel(R) Core(TM) {pc.cpu} / {pc.ram} RAM / {pc.disk} / Windows {pc.os} ACTIVATED</p>
                        ))}
                        <p>
                            Dropped off by: {data.dropoff_person}&emsp;Contact Person: {data.contact_person}<br />
                            Dropped off on: {formatDate(data.dropoff_date)}&emsp;&emsp;&emsp;Cell No: {data.contact_number}<br />
                            Inspected on: {formatDate(data.inspect_date)}
                        </p>
                        <p>
                            Notes:<br />
                            {data.note && <>{data.note}<br /></>}
                            {pcList.map((pc) => (
                                <span key={pc.id}>
                                    **{pc.motherboard} has {pc.usb_front} USB ports at the FRONT, {pc.usb_back} USB ports at the BACK.<br />
                                    **{pc.motherboard} has {pc.motherboard_ports} on the motherboard for video connection.<br />
                                    {pc.gpu_ports && <>**{pc.motherboard} has {pc.gpu_ports} on the video card for video connection.<br /></>}
                                </span>
                            ))}
                        </p>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
