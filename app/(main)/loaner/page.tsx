import type { Metadata } from "next";
import { Page } from "@/components/Page";
import {
	getCategories,
	getLoanerGroupLinks,
	getLoaners,
} from "@/lib/data/loaners";
import LoanersTable from "./LoanersTable";

export const metadata: Metadata = { title: "All Loaners" };

export default async function LoanersPage() {
	const [loaners, categories, groups] = await Promise.all([
		getLoaners(),
		getCategories(),
		getLoanerGroupLinks(),
	]);

	return (
		<Page>
			<LoanersTable loaners={loaners} categories={categories} groups={groups} />
		</Page>
	);
}
