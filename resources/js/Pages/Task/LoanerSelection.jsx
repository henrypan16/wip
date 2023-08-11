import { InputGroup, Col, Row, Form, Button } from 'react-bootstrap';
import { useState } from 'react'


export default function LoanerSelection({addLoaner, allLoaners}) {
    const [all, setAll] = useState(allLoaners);
    const [isChecked, setIsChecked] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedDevice, setSelectedDevice] = useState('');
    const [selectedLoaner, setSelectedLoaner] = useState('');
    const [devices, setDevices] = useState([]);
    const [loaners, setLoaners] = useState([]);

    //Get list of category from all loaners
    let categories = [...new Set(all.map(item => item.category))];

    //Get list of devices based on selected category
    function handleChangeCategory(e) {
        setDevices([...new Set(all.filter(x => x.category === e.target.value).map(item => item.device))])
        setSelectedCategory(e.target.value);
    }

    //Get list of loaners based on selected device
    function handleChangeDevice(e) {
        setLoaners([...all.filter(x => x.device === e.target.value)])
        setSelectedDevice(e.target.value);
        console.log(loaners);
    }

    function handleClick() {
        setLoaners(loaners.filter(x => x.id != selectedLoaner));
        setAll(all.filter(x => x.id != selectedLoaner));
        addLoaner(all[selectedLoaner - 1]);
        setSelectedLoaner('');
    }

    return (
        <>
            <InputGroup className="mb-3" controlid="Loaner">
                <InputGroup.Checkbox checked={isChecked} onChange={() => setIsChecked(!isChecked)} aria-label="Checkbox for following text input" />
                <InputGroup.Text>Loaner</InputGroup.Text>
                <Form.Select disabled={!isChecked} onChange={handleChangeCategory} value={selectedCategory}>
                    <option>Please select a category</option>
                    {categories.map(category => 
                        <option value={category} key={category}>
                            {category}
                        </option>)}
                </Form.Select>
                <Form.Select disabled={!isChecked} onChange={handleChangeDevice} value={selectedDevice}>
                    <option>Please select a device</option>
                    {devices.map(device =>
                        <option value={device} key={device}>
                            {device}
                        </option>
                    )}
                </Form.Select>
                <Form.Select disabled={!isChecked} onChange={(e) => setSelectedLoaner(e.target.value)} value={selectedLoaner}>
                    <option>Please select a loaner</option>
                    {loaners.map(loaner =>
                        <option value={loaner.id} key={loaner.id}>
                            {loaner.name}
                        </option>
                    )}
                </Form.Select>
                <Button disabled={!isChecked || selectedLoaner == ''} type="button" onClick={handleClick}>+</Button>
            </InputGroup>
        </>
    )
}
