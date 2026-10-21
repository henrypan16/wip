import type { Metadata } from 'next';
import Link from 'next/link';
import { DASHBOARD_LOANER_GROUPS, STATUS } from '@/lib/constants';
import { getActiveCategories, getDashboardLoaners } from '@/lib/data/loaners';
import { getOpenTasks } from '@/lib/data/tasks';
import type { Category, Loaner } from '@/lib/types';
import LoanerSection, { LoanerGrid } from './LoanerSection';
import TaskBoard from './TaskBoard';

export const metadata: Metadata = { title: 'Dashboard' };

function Count({ label, value, dot }: { label: string; value: number; dot: string }) {
    return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs sm:text-sm rounded-full bg-white border border-gray-200 text-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300">
            <span className={`w-2 h-2 rounded-full ${dot}`} />
            {label}
            <span className="font-semibold text-gray-900 dark:text-white">{value}</span>
        </span>
    );
}

type LoanerGroup = { title: string; categories: Category[]; nested?: boolean };

// Arrange the active categories into the dashboard groups, dropping groups with
// no active category and collecting unlisted categories under "Other".
function loanerGroups(categories: Category[]): LoanerGroup[] {
    const byName = new Map(categories.map((category) => [category.name, category]));
    const groups: LoanerGroup[] = DASHBOARD_LOANER_GROUPS.map((group) => ({
        ...group,
        categories: group.categories.flatMap((name) => byName.get(name) ?? []),
    }));
    const listed = new Set(DASHBOARD_LOANER_GROUPS.flatMap((group) => group.categories));
    groups.push({ title: 'Other', categories: categories.filter((category) => !listed.has(category.name)) });
    return groups.filter((group) => group.categories.length > 0);
}

function GroupContent({ group, loaners }: { group: LoanerGroup; loaners: Loaner[] }) {
    const inCategory = (category: Category) => loaners.filter((loaner) => loaner.category_id === category.id);
    if (group.nested) {
        return group.categories.map((category) => (
            <LoanerSection key={category.id} title={category.name} loaners={inCategory(category)}>
                <LoanerGrid loaners={inCategory(category)} />
            </LoanerSection>
        ));
    }
    // Name each category only when the group holds more than one.
    return group.categories.map((category) => (
        <LoanerGrid key={category.id} title={group.categories.length > 1 ? category.name : undefined} loaners={inCategory(category)} />
    ));
}

export default async function DashboardPage() {
    const [tasks, loaners, categories] = await Promise.all([getOpenTasks(), getDashboardLoaners(), getActiveCategories()]);

    const ready = tasks.filter((task) => task.status_id === STATUS.READY);
    const pending = tasks.filter((task) => task.status_id !== STATUS.READY);

    // The page fits the window and never scrolls; TaskBoard lays out the task
    // and loaner panels, which scroll on their own.
    return (
        <div className="h-full flex flex-col gap-3 lg:gap-4 px-4 sm:px-6 lg:px-10 py-4 mx-auto w-full max-w-7xl overflow-hidden">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                {/* Small screens show these counts in the collapsed panel headers instead. */}
                <div className="hidden lg:flex flex-1 flex-wrap items-center gap-2">
                    <Count label="Pending" value={pending.length} dot="bg-amber-500" />
                    <Count label="Ready to Go" value={ready.length} dot="bg-green-500" />
                </div>
                <Link href="/task/create"
                    className="ml-auto shrink-0 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-hidden dark:focus:ring-blue-800">
                    + New Task
                </Link>
            </div>

            <TaskBoard pending={pending} ready={ready} loaners={loanerGroups(categories).map((group) => {
                const ids = new Set(group.categories.map((category) => category.id));
                const groupLoaners = loaners.filter((loaner) => ids.has(loaner.category_id));
                return (
                    <LoanerSection key={group.title} title={group.title} loaners={groupLoaners}>
                        <GroupContent group={group} loaners={groupLoaners} />
                    </LoanerSection>
                );
            })} />
        </div>
    );
}
