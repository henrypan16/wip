import { STATUS } from '@/lib/constants';

export const STATUS_COLORS: Record<string, string> = {
    [STATUS.READY]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    [STATUS.COMPLETE]: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    [STATUS.PENDING_REPAIR]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    [STATUS.PENDING_PARTS]: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    [STATUS.PENDING_ACTION]: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
    [STATUS.SCHEDULED]: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
};
export const DEFAULT_STATUS_COLOR = 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';

/** Some Status labels are decorated in Access, e.g. '#-COMPLETE-#'; show them plainly. */
export function statusName(label = ''): string {
    const name = label.replace(/[#-]/g, '').trim();
    return name.length > 3 && name === name.toUpperCase() ? name[0] + name.slice(1).toLowerCase() : name;
}

export default function StatusBadge({ id, label = '', className = '' }: { id: string; label?: string; className?: string }) {
    return (
        <span className={`px-2 py-0.5 text-xs font-medium rounded-full whitespace-nowrap ${STATUS_COLORS[id] ?? DEFAULT_STATUS_COLOR} ${className}`}>{statusName(label)}</span>
    );
}
