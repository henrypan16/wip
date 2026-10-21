'use client';

import { useState } from 'react';
import { InputError, inputClass } from '@/components/Form';
import { FilterPills } from '@/components/Page';
import { TASK_LOANER_GROUPS } from '@/lib/constants';
import { loanerPick, loanerServiceOrder } from '@/lib/format';
import { loanerGroups } from '@/lib/loanerGroups';
import type { Category, Loaner, LoanerGroupLink } from '@/lib/types';

type LoanerPickerProps = {
    /** The loaners to list; those already in `selected` are left out. */
    choices: Loaner[];
    selected: Loaner[];
    /** The task's SO#. A loaner in use can only be picked when its SO# matches this. */
    serviceOrder: string;
    /** Main item / accessory links: adding a main item adds its accessories too. */
    groups: LoanerGroupLink[];
    /** Active categories, so ones with nothing to lend still show. */
    categories: Category[];
    onChange: (selected: Loaner[]) => void;
    error?: string;
};

// Available loaners can be picked; used ones only when their SO# matches the task's.
const canPick = (loaner: Loaner, serviceOrder: string) => ['available', 'match'].includes(loanerPick(loaner, serviceOrder));

/**
 * Pick loaners by category, shown as removable chips. Picking a group's main
 * item adds its accessories as well; the group can then be removed as a whole
 * or one item at a time.
 */
export default function LoanerPicker({ choices, selected, serviceOrder, groups, categories, onChange, error }: LoanerPickerProps) {
    // Accessories left out of the last group added, because they are in use elsewhere.
    const [skipped, setSkipped] = useState<string[]>([]);
    const { accessoriesOf, mainOf } = loanerGroups(groups);
    const selectedIds = new Set(selected.map((loaner) => loaner.id));
    const remaining = choices.filter((loaner) => !selectedIds.has(loaner.id));

    function add(loaner: Loaner) {
        const accessories = (accessoriesOf.get(loaner.id) ?? [])
            .map((id) => remaining.find((choice) => choice.id === id))
            .filter((accessory): accessory is Loaner => accessory !== undefined);
        const lendable = accessories.filter((accessory) => canPick(accessory, serviceOrder));
        setSkipped(accessories.filter((accessory) => !lendable.includes(accessory)).map((accessory) => accessory.name));
        onChange([...selected, loaner, ...lendable]);
    }

    const remove = (ids: number[]) => onChange(selected.filter((loaner) => !ids.includes(loaner.id)));

    // Each selected main item is shown together with its selected accessories.
    const grouped = selected
        .filter((loaner) => accessoriesOf.has(loaner.id))
        .map((main) => ({ main, accessories: selected.filter((loaner) => mainOf.get(loaner.id) === main.id) }))
        .filter((group) => group.accessories.length > 0);
    const inGroup = new Set(grouped.flatMap((group) => [group.main.id, ...group.accessories.map((accessory) => accessory.id)]));
    const single = selected.filter((loaner) => !inGroup.has(loaner.id));

    return (
        <>
            <LoanerSelection allLoaners={remaining} categories={categories} serviceOrder={serviceOrder} accessoriesOf={accessoriesOf} addLoaner={add} />
            {skipped.length > 0 && (
                <p className="mt-2 text-xs text-amber-700 dark:text-amber-400">Not added, in use under another SO#: {skipped.join(', ')}</p>
            )}
            {selected.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                    {grouped.map(({ main, accessories }) => (
                        <div key={main.id} className="w-full flex flex-wrap items-center gap-2 p-2 rounded-lg border border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/40">
                            <LoanerItem loaner={main} main removeLoaner={() => remove([main.id])} />
                            {accessories.map((accessory) => (
                                <LoanerItem key={accessory.id} loaner={accessory} removeLoaner={() => remove([accessory.id])} />
                            ))}
                            <button type="button" onClick={() => remove([main.id, ...accessories.map((accessory) => accessory.id)])}
                                className="ml-auto px-2 py-1 text-xs font-medium rounded-lg text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950">
                                Remove group
                            </button>
                        </div>
                    ))}
                    {single.map((loaner) => (
                        <LoanerItem key={loaner.id} loaner={loaner} removeLoaner={() => remove([loaner.id])} />
                    ))}
                </div>
            )}
            <InputError message={error} />
        </>
    );
}

const DEFAULT_LOANER = 'Select loaner';

// Option colours: a used loaner whose SO# matches the task's is highlighted.
const MATCH_OPTION = 'bg-green-100 text-green-900 font-semibold dark:bg-green-900 dark:text-green-100';
const MATCH_PILL = 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';

const pillClass = 'px-3 py-1 text-sm font-medium rounded-full border transition border-gray-300 text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700';

type LoanerSelectionProps = {
    addLoaner: (loaner: Loaner) => void;
    allLoaners: Loaner[];
    categories: Category[];
    serviceOrder: string;
    accessoriesOf: Map<number, number[]>;
};

// A choice in the picker: one of the TASK_LOANER_GROUPS, or a single category under Other.
type Section = { key: string; label: string; categoryIds: number[] };

/**
 * Choose a group (Computers, Printers, …) or, under the collapsed Other, a
 * single category; then a loaner from it.
 */
function LoanerSelection({ addLoaner, allLoaners, categories, serviceOrder, accessoriesOf }: LoanerSelectionProps) {
    const [sectionKey, setSectionKey] = useState('');
    const [otherOpen, setOtherOpen] = useState(false);
    const [selectedLoaner, setSelectedLoaner] = useState(DEFAULT_LOANER);

    const pick = (loaner: Loaner) => loanerPick(loaner, serviceOrder);
    const pickable = (loaner: Loaner) => canPick(loaner, serviceOrder);

    // Active categories, plus the category of any loaner that is in an inactive one.
    const allCategories = [
        ...categories,
        ...allLoaners
            .filter((l, i, list) => !categories.some((c) => c.id === l.category_id) && list.findIndex((x) => x.category_id === l.category_id) === i)
            .map((l) => ({ id: l.category_id, name: l.category, active: false })),
    ];
    const listed = new Set(TASK_LOANER_GROUPS.flatMap((group) => group.categories));
    const main: Section[] = TASK_LOANER_GROUPS.map((group) => ({
        key: group.title,
        label: group.title,
        categoryIds: allCategories.filter((c) => group.categories.includes(c.name)).map((c) => c.id),
    }));
    const other: Section[] = allCategories
        .filter((c) => !listed.has(c.name))
        .map((c) => ({ key: `category-${c.id}`, label: c.name, categoryIds: [c.id] }));

    const loanersIn = (section: Section) => allLoaners.filter((l) => section.categoryIds.includes(l.category_id));
    const hasMatch = (section: Section) => loanersIn(section).some((l) => pick(l) === 'match');
    const pills = (sections: Section[]) => sections.map((section) => ({
        value: section.key,
        label: hasMatch(section) ? `✓ ${section.label}` : section.label,
        activeClass: hasMatch(section) ? MATCH_PILL : undefined,
    }));

    const current = [...main, ...other].find((section) => section.key === sectionKey);
    const loaners = current ? loanersIn(current) : [];
    const chosen = allLoaners.find((l) => String(l.id) === selectedLoaner);
    // Split the list by category when the section holds more than one.
    const byCategory = current
        ? allCategories.filter((c) => current.categoryIds.includes(c.id)).map((c) => ({ category: c, loaners: loaners.filter((l) => l.category_id === c.id) }))
        : [];

    function optionLabel(loaner: Loaner) {
        const so = loanerServiceOrder(loaner);
        const count = accessoriesOf.get(loaner.id)?.length ?? 0;
        const extras = count ? ` + ${count} ${count === 1 ? 'accessory' : 'accessories'}` : '';
        switch (pick(loaner)) {
            case 'match': return `✓ ${loaner.name}${extras} (SO#${so} matches)`;
            case 'used': return `${loaner.name} (in use, SO#${so})`;
            default: return loaner.name + extras;
        }
    }

    function option(loaner: Loaner) {
        return (
            <option value={loaner.id} key={loaner.id} disabled={!pickable(loaner)}
                className={pick(loaner) === 'match' ? MATCH_OPTION : pick(loaner) === 'used' ? 'text-gray-400 dark:text-gray-500' : ''}>
                {optionLabel(loaner)}
            </option>
        );
    }

    function choose(key: string) {
        setSectionKey(key);
        setSelectedLoaner(DEFAULT_LOANER);
    }

    // When Add is clicked, add the loaner to the task and clear the selection.
    function handleClick() {
        // The SO# may have changed since the loaner was chosen.
        if (!chosen || !pickable(chosen)) return;
        addLoaner(chosen);
        setSelectedLoaner(DEFAULT_LOANER);
    }

    // Show Other as selected when one of its categories is chosen, even while collapsed.
    const otherChosen = other.some((section) => section.key === sectionKey);

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
                {/* Choosing one of the main types folds Other away again. */}
                <FilterPills label="Loaner type" options={pills(main)} value={sectionKey} onSelect={(key) => {
                    choose(key);
                    setOtherOpen(false);
                }} />
                <button type="button" onClick={() => setOtherOpen(!otherOpen)} aria-expanded={otherOpen}
                    className={`${pillClass} inline-flex items-center gap-1 ${otherChosen ? 'ring-2 ring-offset-1 ring-blue-500 dark:ring-offset-gray-800' : ''}`}>
                    Other
                    <svg className={`w-2.5 h-2.5 transition-transform ${otherOpen ? 'rotate-90' : ''}`} aria-hidden="true" fill="none" viewBox="0 0 8 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 13 5.7-5.326a.909.909 0 0 0 0-1.348L1 1" />
                    </svg>
                </button>
            </div>
            {otherOpen && (
                <div className="pl-3 border-l-2 border-gray-200 dark:border-gray-600">
                    <FilterPills label="Other loaner types" options={pills(other)} value={sectionKey} onSelect={choose} />
                </div>
            )}
            <div className="grid gap-2 sm:grid-cols-12">
                <select disabled={!current} onChange={(e) => setSelectedLoaner(e.target.value)} value={selectedLoaner} aria-label="Loaner"
                    className={`${inputClass} sm:col-span-10`}>
                    <option disabled>{current ? (loaners.length ? DEFAULT_LOANER : `No loaners in ${current.label}`) : 'Choose a type above'}</option>
                    {byCategory.length > 1
                        ? byCategory.filter((g) => g.loaners.length).map((g) => (
                            <optgroup key={g.category.id} label={g.category.name}>{g.loaners.map(option)}</optgroup>
                        ))
                        : loaners.map(option)}
                </select>
                <button disabled={!chosen || !pickable(chosen)} type="button" onClick={handleClick}
                    className="sm:col-span-2 text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 dark:border-blue-500 dark:text-blue-400 dark:hover:bg-blue-600 dark:hover:text-white dark:focus:ring-blue-800 disabled:opacity-40 disabled:pointer-events-none">
                    Add
                </button>
            </div>
        </div>
    );
}

function LoanerItem({ removeLoaner, loaner, main = false }: { removeLoaner: () => void; loaner: Loaner; main?: boolean }) {
    return (
        <span className={`inline-flex items-center gap-2 pl-3 pr-1 py-1 text-sm rounded-full border bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-200 ${main ? 'font-semibold' : ''}`}>
            {loaner.name}
            <button type="button" onClick={removeLoaner} aria-label={`Remove ${loaner.name}`}
                className="w-5 h-5 inline-flex items-center justify-center rounded-full hover:bg-blue-200 dark:hover:bg-blue-800">
                <svg className="w-2.5 h-2.5" aria-hidden="true" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                </svg>
            </button>
        </span>
    );
}
