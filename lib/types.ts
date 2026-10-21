// Shapes of the rows returned by lib/data, as aliased in their SQL.

export interface SessionUser {
    id: number;
    name: string;
    email: string;
    remember: boolean;
}

export interface User {
    id: number;
    name: string;
}

export interface Task {
    id: number;
    date: string | null;
    problem: string | null;
    service_order: string | null;
    note: string | null;
    equipment: string | null;
    customer_id: string;
    customer_name: string | null;
    status_id: string;
    note_loaner: string | null;
    note_loaner_printer: string | null;
    /** Names of the loaners lent out with the task, comma separated. */
    loaner?: string;
    /** Status label, on queries that join Status. */
    status?: string;
    /** Name of the user who received the task, on queries that join Users. */
    user?: string | null;
    /** ID of the user who received the task, on getTask. */
    user_id?: number | null;
}

export interface TaskPage {
    data: Task[];
    total: number;
    currentPage: number;
    lastPage: number;
}

export interface Status {
    id: string;
    name: string;
}

export interface Loaner {
    id: number;
    name: string;
    category_id: number;
    category: string;
    /** '0' available, '-1' discontinued, otherwise the CustomerID holding it. */
    status: string;
    note: string | null;
}

export interface Category {
    id: number;
    name: string;
    /** Only active categories are shown on the dashboard. */
    active: boolean;
}

/** Validation messages from a server action, keyed by field name. */
export type FormErrors = Partial<Record<string, string>>;

/** What the form server actions return (they redirect on success, returning nothing). */
export interface ActionResult {
    errors?: FormErrors;
    saved?: boolean;
}
