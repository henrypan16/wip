import type { Metadata } from 'next';
import { getCategories, getLoaners } from '@/lib/data/loaners';
import LoanersTable from './LoanersTable';

export const metadata: Metadata = { title: 'All Loaners' };

export default async function LoanersPage() {
    const [loaners, categories] = await Promise.all([getLoaners(), getCategories()]);

    return (
        <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5 pt-10">
            <div className="mx-auto max-w-(--breakpoint-xl) px-4 lg:px-12">
                <h1 className="text-3xl text-gray-900 dark:text-white mb-6">View All Loaners</h1>
                <LoanersTable loaners={loaners} categories={categories} />
            </div>
        </section>
    );
}
