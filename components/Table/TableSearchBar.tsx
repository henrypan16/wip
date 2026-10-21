import SearchIcon from '@/components/SearchIcon';

export const searchInputClass = 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500';

type TableSearchBarProps = {
    value: string;
    /** Called on every keystroke; results update as you type. */
    onChange: (value: string) => void;
    /** Called on Enter. */
    onSubmit?: () => void;
    id?: string;
    placeholder?: string;
    className?: string;
};

/** A search box that searches as you type. */
export default function TableSearchBar({ value, onChange, onSubmit, id = 'table-search', placeholder = 'Search', className = 'flex items-center w-full sm:max-w-sm' }: TableSearchBarProps) {
    return (
        <form role="search" className={className} onSubmit={(e) => {
            e.preventDefault();
            onSubmit?.();
        }}>
            <label htmlFor={id} className="sr-only">Search</label>
            <div className="relative w-full">
                <SearchIcon />
                <input type="search" id={id} className={searchInputClass} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} />
            </div>
        </form>
    );
}
