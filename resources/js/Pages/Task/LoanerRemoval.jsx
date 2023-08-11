import { InputGroup, Col, Row, Form, Button } from 'react-bootstrap';
import { useState } from 'react'

export default function LoanerRemoval({loaner, removeLoaner}) {
    return (
        <div className="flex mb-3 mr-4 p-2 rounded-lg border border-sky-500" controlid="Loaner">
            <div className="mr-2">{loaner.device} #{loaner.name}</div>
            <Button variant="danger" type="button" onClick={() => removeLoaner(loaner)}>-</Button>
        </div>
    )
}
