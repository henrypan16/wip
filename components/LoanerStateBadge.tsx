import { loanerState } from '@/lib/format';
import type { Loaner } from '@/lib/types';

// Colours for a loaner's state, shared by the dashboard cards and the loaners table.
export const LOANER_STATES = {
    available: {
        label: 'Available',
        card: 'border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-700',
        badge: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    },
    used: {
        label: 'Used',
        card: 'border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-950',
        badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
    },
    discontinued: {
        label: 'Discontinued',
        card: 'border-gray-200 bg-gray-100 opacity-70 dark:border-gray-700 dark:bg-gray-800',
        badge: 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    },
};

export default function LoanerStateBadge({ loaner }: { loaner: Loaner }) {
    const state = LOANER_STATES[loanerState(loaner)];
    return <span className={`px-2 py-0.5 text-xs font-medium rounded-full whitespace-nowrap ${state.badge}`}>{state.label}</span>;
}
