'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { LOANER_AVAILABLE, STATUS } from '@/lib/constants';
import { getLoanersByIds, getTaskLoaners } from '@/lib/data/loaners';
import * as tasks from '@/lib/data/tasks';
import { getUsers } from '@/lib/data/users';
import { requireUser } from '@/lib/session';
import { collect, first, isoDate, maxLength, required, text } from '@/lib/validation';

const STATUS_IDS = Object.values(STATUS);

// Field sizes come from the Tasks table in the Access database.
function validateTaskFields(data) {
    return {
        equipment: first(required(data.equipment, 'equipment'), maxLength(data.equipment, 60, 'equipment')),
        problem: first(required(data.problem, 'problem'), maxLength(data.problem, 60, 'problem')),
        note: maxLength(data.note, 255, 'note'),
        service_order: first(required(data.service_order, 'service order'), maxLength(data.service_order, 10, 'service order')),
    };
}

/** The receiving user's ID, or null when none is chosen and `optional`; undefined when invalid. */
async function receivingUser(value, optional) {
    if (!text(String(value ?? ''))) return optional ? null : undefined;
    const users = await getUsers();
    return users.find((u) => u.id === Number(value))?.id;
}

const USER_ERROR = 'Please select who received the task.';

/**
 * Re-read the chosen loaners so names, categories and availability come from
 * the database, keeping the note each one was chosen with.
 * @returns {Promise<{loaners?: object[], error?: string}>}
 */
async function availableLoaners(selected) {
    const records = await getLoanersByIds(selected.map((l) => Number(l.id)).filter(Number.isInteger));
    if (records.length !== selected.length || records.some((l) => l.status !== LOANER_AVAILABLE)) {
        return { error: 'One of the selected loaners is no longer available. Please reload and choose again.' };
    }
    return {
        loaners: records.map((l) => ({
            ...l,
            note: text(selected.find((s) => Number(s.id) === l.id)?.note).slice(0, 255),
        })),
    };
}

export async function createTask(data) {
    await requireUser();
    const task = {
        customer_id: text(data.customer_id),
        customer_name: text(data.customer_name),
        service_order: text(data.service_order),
        date: text(data.date),
        equipment: text(data.equipment),
        problem: text(data.problem),
        note: text(data.note),
    };
    const userId = await receivingUser(data.user_id, false);
    const errors = collect({
        customer_id: first(required(task.customer_id, 'customer ID'), maxLength(task.customer_id, 8, 'customer ID')),
        customer_name: first(required(task.customer_name, "customer's name"), maxLength(task.customer_name, 50, "customer's name")),
        date: first(required(task.date, 'date'), isoDate(task.date, 'date')),
        user_id: userId === undefined && USER_ERROR,
        ...validateTaskFields(task),
    });
    if (errors) return { errors };

    const { loaners, error } = await availableLoaners(Array.isArray(data.loaners) ? data.loaners : []);
    if (error) return { errors: { loaners: error } };

    await tasks.createTask(task, loaners, userId);
    revalidatePath('/', 'layout');
    redirect('/dashboard');
}

export async function updateTask(id, data) {
    await requireUser();
    const current = await tasks.getTask(Number(id));
    if (!current) return { errors: { equipment: 'This task no longer exists.' } };

    const task = {
        customer_id: current.customer_id,
        equipment: text(data.equipment),
        problem: text(data.problem),
        note: text(data.note),
        status_id: text(data.status_id),
        service_order: text(data.service_order),
        user_id: await receivingUser(data.user_id, true),
    };
    const errors = collect({
        ...validateTaskFields(task),
        status_id: !STATUS_IDS.includes(task.status_id) && 'The selected status is invalid.',
        user_id: task.user_id === undefined && USER_ERROR,
    });
    if (errors) return { errors };

    // Compare the submitted loaners with the ones linked now: new ones must be
    // available; removed ones go back to the pool if still out with this customer.
    const selected = Array.isArray(data.loaners) ? data.loaners : [];
    const selectedIds = new Set(selected.map((l) => Number(l.id)));
    const linked = await getTaskLoaners(current.id);
    const linkedIds = new Set(linked.map((l) => l.id));
    const kept = linked.filter((l) => selectedIds.has(l.id));
    const { loaners: added, error } = await availableLoaners(selected.filter((l) => !linkedIds.has(Number(l.id))));
    if (error) return { errors: { loaners: error } };

    const outWithCustomer = (loaner) => loaner.status === current.customer_id;
    await tasks.updateTask(current.id, task, {
        loaners: [...kept, ...added],
        added,
        removed: linked.filter((l) => !selectedIds.has(l.id)).map((l) => ({ id: l.id, release: outWithCustomer(l) })),
        held: task.service_order !== current.service_order ? kept.filter(outWithCustomer).map((l) => l.id) : [],
    });
    revalidatePath('/', 'layout');
    redirect('/dashboard');
}

/** The dashboard's Complete button: closes the task and returns its loaners with blank notes. */
export async function completeTask(id) {
    await requireUser();
    await tasks.completeTask(Number(id));
    revalidatePath('/', 'layout');
}

/** Used by the dashboard's Ready button. */
export async function setTaskStatus(id, status) {
    await requireUser();
    if (!STATUS_IDS.includes(status)) throw new Error('Invalid status');
    await tasks.setTaskStatus(Number(id), status);
    revalidatePath('/', 'layout');
}

/** Look up a pharmacy name from earlier tasks, to fill in forms. */
export async function lookupCustomerName(customerId) {
    await requireUser();
    const id = text(customerId);
    if (!/^\d{4,8}$/.test(id)) return null;
    return tasks.findCustomerName(id);
}
