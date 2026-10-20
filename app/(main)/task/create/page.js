import CreateTaskForm from '@/components/Task/CreateTaskForm';
import { getAvailableLoaners } from '@/lib/data/loaners';

export const metadata = { title: 'New Task' };

export default async function CreateTaskPage() {
    const loaners = await getAvailableLoaners();
    return <CreateTaskForm allLoaners={loaners} />;
}
