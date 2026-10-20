import Dashboard from '@/components/Dashboard/Dashboard';
import { getActiveLoaners } from '@/lib/data/loaners';
import { getOpenTasks } from '@/lib/data/tasks';

export const metadata = { title: 'Dashboard' };

export default async function DashboardPage() {
    const [tasks, loaners] = await Promise.all([getOpenTasks(), getActiveLoaners()]);
    return <Dashboard tasks={tasks} loaners={loaners} />;
}
