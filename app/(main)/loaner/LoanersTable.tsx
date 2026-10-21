"use client";

import { useState } from "react";
import { inputClass } from "@/components/Form";
import LoanerStateBadge, { LOANER_STATES } from "@/components/LoanerStateBadge";
import {
	cardClass,
	CountPill,
	FilterPills,
	ListToolbar,
	PageHeader,
	primaryButtonClass,
} from "@/components/Page";
import TableData, { type Column } from "@/components/Table/TableData";
import TableNavigation from "@/components/Table/TableNavigation";
import TableSearchBar from "@/components/Table/TableSearchBar";
import { PAGE_SIZE } from "@/lib/constants";
import { loanerServiceOrder, loanerState } from "@/lib/format";
import { loanerGroups } from "@/lib/loanerGroups";
import type { Category, Loaner, LoanerGroupLink } from "@/lib/types";
import LoanerFormModal from "./LoanerFormModal";

const STATE_FILTERS = [
	{ value: "", label: "All" },
	...(["available", "used", "discontinued"] as const).map((state) => ({
		value: state,
		label: LOANER_STATES[state].label,
		activeClass: LOANER_STATES[state].badge,
	})),
];

// Less important columns drop out on narrower screens. The name shows the
// loaner's place in a group: the main item it goes with, or its accessory count.
const columns = (
	nameOf: (id: number) => string,
	{ accessoriesOf, mainOf }: ReturnType<typeof loanerGroups>,
): Column<Loaner>[] => [
	{
		key: "name",
		label: "Name",
		render: (loaner) => {
			const mainId = mainOf.get(loaner.id);
			const count = accessoriesOf.get(loaner.id)?.length ?? 0;
			return (
				<>
					<p className="font-medium text-gray-900 dark:text-white truncate">
						{loaner.name}
					</p>
					{mainId !== undefined && (
						<p className="text-xs truncate">With {nameOf(mainId)}</p>
					)}
					{count > 0 && (
						<p className="text-xs truncate">
							Main item · {count} {count === 1 ? "accessory" : "accessories"}
						</p>
					)}
				</>
			);
		},
	},
	{ key: "category", label: "Category", className: "hidden sm:table-cell" },
	{
		key: "service_order",
		label: "SO#",
		className: "hidden md:table-cell w-32 font-mono",
		render: (loaner) =>
			loanerServiceOrder(loaner) ? `SO#${loanerServiceOrder(loaner)}` : "—",
	},
	{
		key: "status",
		label: "Status",
		className: "w-32",
		render: (loaner) => <LoanerStateBadge loaner={loaner} />,
	},
];

export default function LoanersTable({
	loaners,
	categories,
	groups,
}: {
	loaners: Loaner[];
	categories: Category[];
	groups: LoanerGroupLink[];
}) {
	const lookups = loanerGroups(groups);
	const nameOf = (id: number) => loaners.find((l) => l.id === id)?.name ?? "";
	const [search, setSearch] = useState("");
	const [state, setState] = useState("");
	const [categoryId, setCategoryId] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	// The loaner open in the form: a loaner to edit, null to add one, undefined when closed.
	const [editing, setEditing] = useState<Loaner | null | undefined>(
		undefined,
	);

	const filtered = loaners.filter(
		(loaner) =>
			loaner.name.toLowerCase().includes(search.toLowerCase()) &&
			(!state || loanerState(loaner) === state) &&
			(!categoryId || String(loaner.category_id) === categoryId),
	);
	const lastPage = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
	const page = Math.min(currentPage, lastPage);
	const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
	const count = (s: string) =>
		loaners.filter((loaner) => loanerState(loaner) === s).length;

	// Any change to the filters starts again from the first page.
	function filterBy(update: () => void) {
		update();
		setCurrentPage(1);
	}

	return (
		<>
			<PageHeader
				title="Loaners"
				counts={
					<>
						<CountPill
							label="Available"
							value={count("available")}
							dot="bg-green-500"
						/>
						<CountPill
							label="Used"
							value={count("used")}
							dot="bg-amber-500"
						/>
					</>
				}
				action={
					<button
						type="button"
						onClick={() => setEditing(null)}
						className={primaryButtonClass}>
						+ Add Loaner
					</button>
				}
			/>
			<div className={cardClass}>
				<ListToolbar>
					<div className="flex flex-col sm:flex-row gap-3">
						<TableSearchBar
							value={search}
							onChange={(value) =>
								filterBy(() => setSearch(value))
							}
							placeholder="Search loaners"
						/>
						<select
							value={categoryId}
							onChange={(e) =>
								filterBy(() => setCategoryId(e.target.value))
							}
							aria-label="Category"
							className={`${inputClass} sm:w-56`}>
							<option value="">All categories</option>
							{categories.map((category) => (
								<option key={category.id} value={category.id}>
									{category.name}
									{category.active ? "" : " (inactive)"}
								</option>
							))}
						</select>
					</div>
					<FilterPills
						label="Status"
						options={STATE_FILTERS}
						value={state}
						onSelect={(value) => filterBy(() => setState(value))}
					/>
				</ListToolbar>
				<TableData
					columns={columns(nameOf, lookups)}
					rows={rows}
					onRowClick={setEditing}
					empty="No loaners found."
				/>
				<TableNavigation
					total={filtered.length}
					pageSize={PAGE_SIZE}
					currentPage={page}
					onPage={setCurrentPage}
				/>
			</div>
			<LoanerFormModal
				show={editing !== undefined}
				loaner={editing ?? null}
				categories={categories}
				loaners={loaners}
				groups={groups}
				onClose={() => setEditing(undefined)}
			/>
		</>
	);
}
