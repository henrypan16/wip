import { Link, Head } from '@inertiajs/react';
import { Button, Form, Container, Navbar, Nav, InputGroup, Col, Row, Stack} from 'react-bootstrap';
import { useState } from 'react';
import { router } from '@inertiajs/react'
import { useForm } from '@inertiajs/react'
import LoanerSelection from './Task/LoanerSelection'
import LoanerRemoval from './Task/LoanerRemoval'

export default function Welcome({ customers, allLoaners}) {
    const [id, setId] = useState('');
    const [pharmacy, setPharmacy] = useState('');
    const [loaners, setLoaners] = useState([]);
    const [date, setDate] = useState(dateConverter(new Date()))
    const { data, setData, post, processing, errors } = useForm({
        
    })

    function handleChange(e) {
        let newId = e.target.value;
        if(newId < 1) {
            setId('');
            setPharmacy('');
        } else if(newId > customers.length) {
            setId(customers.length)
            setPharmacy(customers[customers.length-1].name);
        } else {
            setId(newId);
            setPharmacy(customers[newId-1].name);
        }
        return;
    }

    function handleDateChange(e) {
        let date = new Date(e.target.value);
        setDate(dateConverter(date));
    }

    function dateConverter(date) {
        return date.toISOString().split('T')[0]
    }

    function addLoaner(selectedLoaner) {
        allLoaners = allLoaners.filter(loaner => loaner.id != selectedLoaner.id);
        console.log(allLoaners);
        setLoaners([...loaners, selectedLoaner]);
    }

    function removeLoaner(selectedLoaner) {
        allLoaners.push(selectedLoaner)
        setLoaners(loaners.filter(loaner => loaner.id != selectedLoaner.id))
    }

    return (
        <>
            <Head title="FTWIP" />
            <Navbar>
                <Container>
                    <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link href="#home">Home</Nav.Link>
                        <Nav.Link href="#features">Features</Nav.Link>
                        <Nav.Link href="#pricing">Pricing</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
            <Container>
                <Form>

                    <Form.Group as={Col} className="mb-3" controlid="Customer">
                    <Form.Label>Customer</Form.Label>
                        <InputGroup>
                            <Form.Control value={id} onChange={handleChange} type="number" placeholder="Customer ID"/>
                            <Form.Control value={pharmacy} type="text" readOnly={true} placeholder="Pharmacy Name"/>
                        </InputGroup>
                    </Form.Group>

                    <Row>
                        <Col>
                            <Form.Group controlid="TagID">
                                    <Form.Label>Tag#</Form.Label>
                                    <Form.Control type="number" placeholder="" />
                            </Form.Group>
                        </Col>

                        <Col>
                            <Form.Group className="mb-3" controlid="Date">
                                <Form.Label>SO#</Form.Label>
                                <Form.Control type="number"/>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3" controlid="Date">
                                <Form.Label>Date</Form.Label>
                                <Form.Control value={date} onChange={handleDateChange} type="date"/>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3" controlid="Equipment">
                        <Form.Label>Equipment</Form.Label>
                        <Form.Control type="text" placeholder=""/>
                    </Form.Group>

                    <Form.Group className="mb-3" controlid="Problem">
                        <Form.Label>Problem</Form.Label>
                        <Form.Control type="text" placeholder="" />
                    </Form.Group>

                    <Form.Group className="mb-3" controlid="Status">
                        <Form.Label>Status</Form.Label>
                        <Form.Select>
                            <option>Open this select menu</option>
                            <option value="1">One</option>
                            <option value="2">Two</option>
                            <option value="3">Three</option>
                        </Form.Select>
                    </Form.Group>
                    
                    
                    <LoanerSelection addLoaner={addLoaner} allLoaners={allLoaners}/>
                    <div className="flex flex-wrap">
                            {loaners.map((loaner) => <LoanerRemoval key={loaner.id} removeLoaner={removeLoaner} loaner={loaner}/>)}
                    </div>
                    

                    <Button variant="primary" type="submit">
                         Submit New Task
                    </Button>
                    
                    <Button type="submit">
                        Save Change
                    </Button>
                </Form>
                <Button type="button">Previous</Button>
                <Button type="button">Next</Button>
                <Button type="button">Go To First</Button>
                <Button type="button">Go To End</Button>

            </Container>
        </>
    );
}
