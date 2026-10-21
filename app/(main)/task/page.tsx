import type { Metadata } from "next";
import Link from "next/link";
import { Page, PageHeader, primaryButtonClass } from "@/components/Page";
import { getStatuses, getTaskPage } from "@/lib/data/tasks";
import TasksTable from "./TasksTable";

export const metadata: Metadata = { title: "All Tasks" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function TasksPage({
	searchParams,
}: {
	searchParams: SearchParams;
}) {
	const params = await searchParams;
	const search =
		typeof params.search === "string"
			? params.search.trim().slice(0, 100)
			: "";
	const status = typeof params.status === "string" ? params.status : "";
	const page = Math.max(
		1,
		Number.parseInt(
			typeof params.page === "string" ? params.page : "",
			10,
		) || 1,
	);

	const [tasks, statuses] = await Promise.all([
		getTaskPage({ page, search, status }),
		getStatuses(),
	]);

	return (
		<Page>
			<PageHeader
				title="Tasks"
				action={
					<Link href="/task/create" className={primaryButtonClass}>
						+ New Task
					</Link>
				}
			/>
			<TasksTable
				tasks={tasks}
				search={search}
				status={status}
				statuses={statuses}
			/>
		</Page>
	);
}
