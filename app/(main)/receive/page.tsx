import type { Metadata } from 'next';
import ReceiveForm from './ReceiveForm';

export const metadata: Metadata = { title: '3rd Party Items' };

export default function ReceivePage() {
    return <ReceiveForm />;
}
