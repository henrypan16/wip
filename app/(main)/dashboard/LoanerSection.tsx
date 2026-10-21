"use client";

import { type FormEvent, type ReactNode, useState, useTransition } from "react";
import { saveLoanerServiceOrder } from "@/actions/loaners";
import { LOANER_STATES } from "@/components/LoanerStateBadge";
import {
	loanerServiceOrder,
	loanerState,
	padDigits,
	SERVICE_ORDER_DIGITS,
} from "@/lib/format";
import type { Loaner } from "@/lib/types";

// A header summarising `loaners` that expands to show `children` when clicked.
export default function LoanerSection({
	loaners,
	title,
	children,
}: {
	loaners: Loaner[];
	title: string;
	children: ReactNode;
}) {
	const [open, setOpen] = useState(false);
	// Discontinued loaners are listed but not counted.
	const inService = loaners.filter(
		(loaner) => loanerState(loaner) !== "discontinued",
	).length;
	const available = loaners.filter(
		(loaner) => loanerState(loaner) === "available",
	).length;
	const percent = inService ? Math.round((available / inService) * 100) : 0;

	return (
		<section className="bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
			<button
				type="button"
				onClick={() => setOpen(!open)}
				aria-expanded={open}
				className="w-full flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-3 text-left rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-hidden focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-800">
				<svg
					className={`w-3 h-3 shrink-0 text-gray-500 dark:text-gray-400 transition-transform ${open ? "rotate-90" : ""}`}
					aria-hidden="true"
					fill="none"
					viewBox="0 0 8 14">
					<path
						stroke="currentColor"
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						d="m1 13 5.7-5.326a.909.909 0 0 0 0-1.348L1 1"
					/>
				</svg>
				<span className="flex-1 min-w-0 truncate font-semibold text-gray-900 dark:text-white">
					{title}
				</span>
				<span className="hidden sm:block w-32 h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
					<span
						className="block h-full bg-green-500"
						style={{ width: `${percent}%` }}
					/>
				</span>
				<span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
					{available} of {inService} available
				</span>
			</button>

			{open && (
				<div className="px-3 sm:px-4 pb-4 pt-3 border-t border-gray-200 dark:border-gray-700 flex flex-col gap-3">
					{children}
				</div>
			)}
		</section>
	);
}

// The loaner cards of one category, under its name when `title` is given.
export function LoanerGrid({
	loaners,
	title,
}: {
	loaners: Loaner[];
	title?: string;
}) {
	return (
		<div>
			{title && (
				<h3 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
					{title}
				</h3>
			)}
			{loaners.length === 0 ? (
				<p className="text-sm text-gray-500 dark:text-gray-400">
					No loaners in this category.
				</p>
			) : (
				<div className="grid gap-3 grid-cols-[repeat(auto-fill,minmax(10rem,1fr))]">
					{loaners.map((loaner) => (
						<LoanerCard key={loaner.id} loaner={loaner} />
					))}
				</div>
			)}
		</div>
	);
}

// The note is the service order the loaner is out with, shown as SO#000000.
// Clicking it opens an editor for the number; clearing it makes the loaner available.
function LoanerCard({ loaner }: { loaner: Loaner }) {
	const [serviceOrder, setServiceOrder] = useState(
		loanerServiceOrder(loaner),
	);
	const [editing, setEditing] = useState(false);
	const [pending, startTransition] = useTransition();

	const state = loanerState(loaner);
	const style = LOANER_STATES[state];
	const saved = loanerServiceOrder(loaner);

	function save(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		startTransition(async () => {
			await saveLoanerServiceOrder(loaner.id, serviceOrder);
			setEditing(false);
		});
	}

	function cancel() {
		setServiceOrder(saved);
		setEditing(false);
	}

	return (
		<div className={`p-3 rounded-lg border ${style.card}`}>
			<div className="flex items-start justify-between gap-2">
				<p className="text-sm font-semibold text-gray-900 dark:text-white">
					{loaner.name}
				</p>
				<span
					className={`px-2 py-0.5 text-xs font-medium rounded-full whitespace-nowrap ${style.badge}`}>
					{style.label}
				</span>
			</div>

			{editing ? (
				<form onSubmit={save} className="mt-2 flex flex-col gap-2">
					<div className="flex items-center bg-white border border-gray-300 rounded-lg focus-within:ring-1 focus-within:ring-primary-600 focus-within:border-primary-600 dark:bg-gray-800 dark:border-gray-600">
						<span className="pl-1.5 text-sm font-mono text-gray-500 dark:text-gray-400">
							SO#
						</span>
						<input
							value={serviceOrder}
							onChange={(e) =>
								setServiceOrder(
									padDigits(e.target.value, SERVICE_ORDER_DIGITS),
								)
							}
							inputMode="numeric"
							placeholder="000000"
							autoFocus
							aria-label={`Service order for ${loaner.name}`}
							onKeyDown={(e) => e.key === "Escape" && cancel()}
							className="min-w-0 flex-1 bg-transparent border-0 p-1.5 pl-0.5 text-sm font-mono text-gray-900 focus:ring-0 dark:text-white"
						/>
					</div>
					<div className="flex gap-2">
						<button
							type="submit"
							disabled={pending}
							className="flex-1 rounded-lg text-xs font-medium px-2 py-1 text-white bg-green-700 hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-700 disabled:opacity-60">
							Save
						</button>
						<button
							type="button"
							onClick={cancel}
							className="flex-1 rounded-lg text-xs font-medium px-2 py-1 text-gray-700 bg-white border border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
							Cancel
						</button>
					</div>
				</form>
			) : state === "discontinued" ? (
				<p className="mt-2 text-xs font-mono truncate text-gray-500 dark:text-gray-400">
					{saved && `SO#${saved}`}
				</p>
			) : (
				<button
					type="button"
					onClick={() => setEditing(true)}
					title="Edit service order"
					className="mt-2 block w-full text-left text-xs font-mono truncate text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
					{saved ? (
						`SO#${saved}`
					) : (
						<span className="italic font-sans">Add SO#…</span>
					)}
				</button>
			)}
		</div>
	);
}
