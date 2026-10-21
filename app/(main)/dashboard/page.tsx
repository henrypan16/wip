import type { Metadata } from 'next';
import Link from 'next/link';
import { CountPill, PageHeader, primaryButtonClass } from '@/components/Page';
import { DASHBOARD_LOANER_GROUPS, STATUS } from '@/lib/constants';
import { getActiveCategories, getDashboardLoaners } from '@/lib/data/loaners';
import { getOpenTasks } from '@/lib/data/tasks';
import type { Category, Loaner } from '@/lib/types';
import LoanerSection, { LoanerGrid } from './LoanerSection';
import TaskBoard from './TaskBoard';

export const metadata: Metadata = { title: 'Dashboard' };

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
            {/* Small screens show the counts in the collapsed panel headers instead. */}
            <PageHeader
                title="Dashboard"
                countsClassName="hidden lg:flex"
                counts={<>
                    <CountPill label="Pending" value={pending.length} dot="bg-amber-500" />
                    <CountPill label="Ready to Go" value={ready.length} dot="bg-green-500" />
                </>}
                action={<Link href="/task/create" className={primaryButtonClass}>+ New Task</Link>}
            />

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
