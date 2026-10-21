"use client";

import Link from "next/link";
import { type ReactNode, useCallback, useState, useTransition } from "react";
import { completeTask, setTaskStatus } from "@/actions/tasks";
import CloseButton from "@/components/CloseButton";
import Modal from "@/components/Modal";
import StatusBadge from "@/components/StatusBadge";
import { STATUS } from "@/lib/constants";
import { age, formatDate, padCustomerId } from "@/lib/format";
import type { Task } from "@/lib/types";

type Panel = "pending" | "ready" | "loaners";

// The Pending, Ready to Go and Loaners panels, and the details window for the
// clicked task. On wide screens all three are shown, with the loaners filling
// the remaining height. On smaller screens they collapse to their headers and
// open one at a time, filling the screen, when clicked.
export default function TaskBoard({
	pending,
	ready,
	loaners,
}: {
	pending: Task[];
	ready: Task[];
	loaners: ReactNode;
}) {
	const [selectedId, setSelectedId] = useState<number | null>(null);
	const [openPanel, setOpenPanel] = useState<Panel | null>(null);
	const closeModal = useCallback(() => setSelectedId(null), []);
	const selected =
		[...pending, ...ready].find((task) => task.id === selectedId) ?? null;
	const toggle = (panel: Panel) =>
		setOpenPanel(openPanel === panel ? null : panel);
	const loanersOpen = openPanel === "loaners";

	return (
		<>
			{/* `contents` lets the sections size themselves in the page column on small screens. */}
			<div className="contents lg:grid lg:shrink-0 lg:grid-cols-2 lg:gap-4">
				<TaskSection
					title="Pending"
					tasks={pending}
					click={setSelectedId}
					accent="bg-amber-500"
					empty="No pending tasks."
					open={openPanel === "pending"}
					onToggle={() => toggle("pending")}
				/>
				<TaskSection
					title="Ready to Go"
					tasks={ready}
					click={setSelectedId}
					accent="bg-green-500"
					empty="Nothing is ready for pickup."
					open={openPanel === "ready"}
					onToggle={() => toggle("ready")}
				/>
			</div>
			<section
				className={`flex flex-col min-h-0 ${loanersOpen ? "flex-1" : "shrink-0"} lg:flex-1`}>
				<button
					type="button"
					onClick={() => toggle("loaners")}
					aria-expanded={loanersOpen}
					className="flex items-center gap-2 px-3 py-2 text-left bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 lg:p-0 lg:bg-transparent lg:border-0 lg:shadow-none lg:pointer-events-none dark:lg:bg-transparent">
					<Chevron open={loanersOpen} />
					<h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
						Loaners
					</h2>
				</button>
				<div
					className={`${loanersOpen ? "flex" : "hidden"} lg:flex flex-1 min-h-0 mt-2 overflow-y-auto flex-col gap-3 pr-1`}>
					{loaners}
				</div>
			</section>
			<TaskModal task={selected} onClose={closeModal} />
		</>
	);
}

// Shows whether a panel is open; only needed on small screens.
function Chevron({ open }: { open: boolean }) {
	return (
		<svg
			className={`lg:hidden w-3 h-3 shrink-0 text-gray-500 dark:text-gray-400 transition-transform ${open ? "rotate-90" : ""}`}
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
	);
}

type TaskSectionProps = {
	tasks: Task[];
	title: string;
	click: (id: number) => void;
	accent: string;
	empty: string;
	open: boolean;
	onToggle: () => void;
};

// Received date, oldest first; ties (same day) fall back to task number.
function byDate(a: Task, b: Task) {
	return (a.date ?? "").localeCompare(b.date ?? "") || a.id - b.id;
}

function TaskSection({
	tasks,
	title,
	click,
	accent,
	empty,
	open,
	onToggle,
}: TaskSectionProps) {
	const [newestFirst, setNewestFirst] = useState(false);
	const sorted = [...tasks].sort((a, b) =>
		newestFirst ? byDate(b, a) : byDate(a, b),
	);
	const sortLabel = newestFirst ? "Newest first" : "Oldest first";

	return (
		<section className={`flex flex-col min-h-0 ${open ? "flex-1" : "shrink-0"} lg:flex-none bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700`}>
			<header
				className={`flex items-center gap-2 px-3 sm:px-4 py-2 border-gray-200 dark:border-gray-700 ${open ? "border-b" : ""} lg:border-b`}>
				<button
					type="button"
					onClick={onToggle}
					aria-expanded={open}
					className="flex flex-1 min-w-0 items-center gap-2 text-left lg:pointer-events-none">
					<Chevron open={open} />
					<h2 className="flex flex-1 min-w-0 items-center gap-2 text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
						<span
							className={`w-2.5 h-2.5 shrink-0 rounded-full ${accent}`}
						/>
						<span className="truncate">{title}</span>
						<span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
							{tasks.length}
						</span>
					</h2>
				</button>
				<button
					type="button"
					onClick={() => setNewestFirst(!newestFirst)}
					disabled={tasks.length < 2}
					title={`Sorted by received date, ${sortLabel.toLowerCase()}. Click to reverse.`}
					aria-label={`Sort by date: ${sortLabel}`}
					className="inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 disabled:opacity-40 disabled:pointer-events-none">
					<svg
						className="w-3.5 h-3.5"
						aria-hidden="true"
						fill="none"
						viewBox="0 0 16 16">
						<path
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="1.5"
							d={
								newestFirst
									? "M5 13V3m0 0L2 6m3-3 3 3M11 3v10m0 0-3-3m3 3 3-3"
									: "M5 3v10m0 0-3-3m3 3 3-3M11 13V3m0 0L8 6m3-3 3 3"
							}
						/>
					</svg>
					<span className="hidden sm:inline">{sortLabel}</span>
					<span className="sm:hidden">Date</span>
				</button>
				<Link
					href="/task"
					className="shrink-0 text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
					View all
				</Link>
			</header>
			{/* Hidden while collapsed on small screens; capped on wide screens so the loaners stay in view. */}
			{tasks.length === 0 ? (
				<p
					className={`${open ? "" : "hidden"} lg:block px-4 py-6 text-sm text-center text-gray-500 dark:text-gray-400`}>
					{empty}
				</p>
			) : (
				<ul
					className={`${open ? "" : "hidden"} lg:block min-h-0 flex-1 lg:flex-none lg:max-h-[30vh] overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700`}>
					{sorted.map((task) => (
						<li key={task.id}>
							<TaskRow task={task} handleClick={click} />
						</li>
					))}
				</ul>
			)}
		</section>
	);
}

// On phones a row is a single line: customer ID, the start of the equipment, status and age.
function TaskRow({
	task,
	handleClick,
}: {
	task: Task;
	handleClick: (id: number) => void;
}) {
	return (
		<button
			type="button"
			onClick={() => handleClick(task.id)}
			className="w-full text-left px-3 sm:px-4 py-2 flex items-center gap-2 sm:gap-4 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-hidden focus:bg-gray-50 dark:focus:bg-gray-700">
			<span className="sm:hidden shrink-0 font-mono text-sm font-semibold text-gray-900 dark:text-white">
				{padCustomerId(task.customer_id)}
			</span>
			<span className="sm:hidden min-w-0 flex-1 truncate text-sm text-gray-600 dark:text-gray-300">
				{task.equipment}
			</span>
			<StatusBadge
				id={task.status_id}
				label={task.status}
				className="sm:hidden shrink-0"
			/>
			<span
				className="sm:hidden shrink-0 w-9 text-right text-xs text-gray-500 dark:text-gray-400"
				suppressHydrationWarning>
				{age(task.date, true)}
			</span>

			<div className="hidden sm:block min-w-0 flex-1">
				<p className="font-semibold text-gray-900 dark:text-white truncate">
					{task.equipment}
				</p>
				<p className="text-sm text-gray-500 dark:text-gray-400 truncate">
					{padCustomerId(task.customer_id)}
					{task.customer_name ? ` · ${task.customer_name}` : ""}
					{task.service_order ? ` · SO#${task.service_order}` : ""}
				</p>
			</div>
			<div className="hidden sm:flex flex-col items-end gap-1 shrink-0">
				<StatusBadge id={task.status_id} label={task.status} />
				<span
					className="text-xs text-gray-500 dark:text-gray-400"
					title={`Received ${formatDate(task.date)}`}
					suppressHydrationWarning>
					{age(task.date)}
				</span>
			</div>
		</button>
	);
}

function Detail({ label, children }: { label: string; children: ReactNode }) {
	return (
		<div>
			<dt className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
				{label}
			</dt>
			<dd className="mt-1 text-sm text-gray-900 dark:text-white">
				{children || (
					<span className="text-gray-400 dark:text-gray-500">—</span>
				)}
			</dd>
		</div>
	);
}

function Block({ label, children }: { label: string; children: ReactNode }) {
	return (
		<div>
			<h4 className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
				{label}
			</h4>
			<p className="mt-1 p-3 text-sm rounded-lg whitespace-pre-wrap bg-gray-50 text-gray-900 dark:bg-gray-800 dark:text-white">
				{children}
			</p>
		</div>
	);
}

function TaskModal({
	task,
	onClose,
}: {
	task: Task | null;
	onClose: () => void;
}) {
	const [pending, startTransition] = useTransition();

	function changeStatus(status: string) {
		if (!task) return;
		startTransition(async () => {
			await setTaskStatus(task.id, status);
			onClose();
		});
	}

	// Completing also returns the task's loaners to the pool with blank notes.
	function complete() {
		if (!task) return;
		startTransition(async () => {
			await completeTask(task.id);
			onClose();
		});
	}

	return (
		<Modal show={!!task} onClose={onClose}>
			{task && (
				<div className="relative bg-white rounded-xl shadow-lg dark:bg-gray-700 overflow-hidden">
					<div className="flex items-start gap-4 px-5 pt-5 pb-4 border-b border-gray-200 dark:border-gray-600">
						<div className="min-w-0 flex-1">
							<div className="flex flex-wrap items-center gap-2">
								<h3 className="text-xl font-bold text-gray-900 dark:text-white">
									{task.equipment}
								</h3>
								<StatusBadge
									id={task.status_id}
									label={task.status}
								/>
							</div>
							<p className="mt-1 text-gray-600 dark:text-gray-300">
								<span className="font-mono">
									{padCustomerId(task.customer_id)}
								</span>{" "}
								· {task.customer_name}
							</p>
						</div>
						<CloseButton onClick={onClose} />
					</div>

					<div className="px-5 py-5 space-y-5">
						<dl className="grid grid-cols-2 sm:grid-cols-3 gap-4">
							<Detail label="Service Order">
								{task.service_order &&
									`SO#${task.service_order}`}
							</Detail>
							<Detail label="Received">
								{formatDate(task.date)}{" "}
								<span
									className="text-gray-500 dark:text-gray-400"
									suppressHydrationWarning>
									({age(task.date)})
								</span>
							</Detail>
							<Detail label="Received By">{task.user}</Detail>
						</dl>
						<Block label="Problem">{task.problem}</Block>
						{task.note && <Block label="Note">{task.note}</Block>}
						{task.loaner && (
							<Block label="Loaners">{task.loaner}</Block>
						)}
					</div>

					<div className="flex flex-wrap items-center gap-2 px-5 py-4 bg-gray-50 border-t border-gray-200 dark:bg-gray-800 dark:border-gray-600">
						<Link
							href={`/task/${task.id}/edit`}
							className="text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-4 py-2 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600 dark:focus:ring-gray-700">
							Edit
						</Link>
						<div className="flex gap-2 ml-auto">
							{task.status_id !== STATUS.READY && (
								<button
									onClick={() => changeStatus(STATUS.READY)}
									disabled={pending}
									type="button"
									className="focus:ring-4 focus:outline-hidden rounded-lg text-sm font-medium px-4 py-2 text-white bg-green-700 hover:bg-green-800 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 disabled:opacity-60">
									Mark Ready
								</button>
							)}
							<button
								onClick={complete}
								disabled={pending}
								type="button"
								className="focus:outline-hidden text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900 disabled:opacity-60">
								Complete
							</button>
						</div>
					</div>
				</div>
			)}
		</Modal>
	);
}
