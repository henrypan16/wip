import { InputGroup, Col, Row, Form, Button } from 'react-bootstrap';
import { useState } from 'react'


export default function LoanerSelection({addLoaner, allLoaners}) {
    const defaultState = {
        category: 'Select category',
        device: 'Select device',
        loaner: 'Select loaner'
    }
    const [isChecked, setIsChecked] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(defaultState.category);
    const [selectedDevice, setSelectedDevice] = useState(defaultState.device);
    const [selectedLoaner, setSelectedLoaner] = useState(defaultState.loaner);
    const [devices, setDevices] = useState([]);
    const [loaners, setLoaners] = useState([]);

    //Get list of category from all loaners
    let categories = [...new Set(allLoaners.map(item => item.category))];

    //Get list of devices based on selected category
    function handleChangeCategory(e) {
        setDevices([...new Set(allLoaners.filter(x => x.category === e.target.value).map(item => item.device))])
        setSelectedCategory(e.target.value);
        setSelectedDevice(defaultState.device);
        setSelectedLoaner(defaultState.loaner);
    }

    //Get list of loaners based on selected device
    function handleChangeDevice(e) {
        setLoaners([...allLoaners.filter(x => x.device === e.target.value)])
        setSelectedDevice(e.target.value);
    }
    
    //When + button is clicked, add a loaner to list and clear all selection
    function handleClick() {
        addLoaner(allLoaners.find((loaner) => loaner.id == selectedLoaner));
        setSelectedDevice(defaultState.device);
        setSelectedLoaner(defaultState.loaner);
        setLoaners([]);
    }

    return (
        <>
            <div className="sm:col-span-2 flex justify-center items-center">
                <input type="checkbox" checked={isChecked} onChange={() => setIsChecked(!isChecked)} aria-label="Checkbox for following text input" name="check" id="date" className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" required=""/>
                <label htmlFor="date" className="items-center ml-2 text-sm font-medium text-gray-900 dark:text-white">Loaner</label>
            </div>
            <div className="sm:col-span-5">
                <select disabled={!isChecked} onChange={handleChangeCategory} value={selectedCategory} id="category" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                    <option disabled>Select category</option>
                    {categories.map(category => 
                        <option value={category} key={category}>
                            {category}
                        </option>)
                    }
                </select>
            </div>
            <div  className="sm:col-span-5">
                <select disabled={!isChecked} onChange={handleChangeDevice} value={selectedDevice} id="category" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                    <option disabled>Select device</option>
                    {devices.map(device =>
                        <option value={device} key={device}>
                            {device}
                        </option>
                    )}
                </select>
            </div>
            <div  className="sm:col-span-4">
                <select disabled={!isChecked} onChange={(e) => setSelectedLoaner(e.target.value)} value={selectedLoaner} id="category" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                    <option disabled>Select loaner</option>
                    {loaners.map(loaner =>
                        <option value={loaner.id} key={loaner.id}>
                            {loaner.name}
                        </option>)
                    }
                </select>
            </div>
            <div className="sm:col-span-2">
                <button disabled={!isChecked || selectedLoaner == defaultState.loaner} type="button" onClick={handleClick} className="dark:disabled:bg-blue-900 disabled:bg-blue-900 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 rounded-lg text-sm px-4 py-2.5 mb-2 ml-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">+</button>
            </div>
        </>
    )
}
