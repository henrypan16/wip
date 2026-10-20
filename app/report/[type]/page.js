import { notFound } from 'next/navigation';
import { REPORTS } from '@/lib/constants';
import { getReportTasks } from '@/lib/data/tasks';
import { padCustomerId } from '@/lib/format';
import { requireUser } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
    const report = REPORTS[(await params).type];
    return { title: report?.title ?? 'Report' };
}

// Printable list of tasks in one status, rendered without the app chrome.
export default async function ReportPage({ params }) {
    await requireUser();
    const report = REPORTS[(await params).type];
    if (!report) notFound();

    const tasks = await getReportTasks(report.status);

    return (
        <main className="bg-white text-gray-900 min-h-screen">
            <h1 className="m-4 text-xl">{report.title}</h1>
            <table className="text-sm text-left text-gray-500 table-fixed w-full">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="px-1 py-3 w-12">ID</th>
                        <th scope="col" className="px-1 py-3 w-52">Pharmacy Name</th>
                        <th scope="col" className="px-1 py-3 w-16">SO#</th>
                        <th scope="col" className="px-1 py-3 w-48">Problem</th>
                        <th scope="col" className="px-1 py-3 w-48">Note</th>
                        <th scope="col" className="px-1 py-3 w-24">Loaner</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((task) => (
                        <tr key={task.id} className="border-b">
                            <td className="px-1 py-1 truncate">{padCustomerId(task.customer_id)}</td>
                            <td className="px-1 py-1 truncate">{task.customer_name}</td>
                            <td className="px-1 py-1 truncate">{task.service_order}</td>
                            <td className="px-1 py-1 truncate">{task.problem}</td>
                            <td className="px-1 py-1 truncate">{task.note}</td>
                            <td className="px-1 py-1 truncate">{task.loaner}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </main>
    );
}
