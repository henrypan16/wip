'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { LOANER_AVAILABLE, STATUS } from '@/lib/constants';
import { getLoanersByIds } from '@/lib/data/loaners';
import * as tasks from '@/lib/data/tasks';
import { requireUser } from '@/lib/session';
import { collect, first, isoDate, maxLength, required, text } from '@/lib/validation';

const STATUS_IDS = Object.values(STATUS);

// Field sizes come from the Tasks table in the Access database.
function validateTaskFields(data) {
    return {
        title: first(required(data.title, 'title'), maxLength(data.title, 100, 'title')),
        equipment: first(required(data.equipment, 'equipment'), maxLength(data.equipment, 60, 'equipment')),
        problem: first(required(data.problem, 'problem'), maxLength(data.problem, 60, 'problem')),
        note: maxLength(data.note, 255, 'note'),
    };
}

export async function createTask(data) {
    const user = await requireUser();
    const task = {
        customer_id: text(data.customer_id),
        customer_name: text(data.customer_name),
        service_order: text(data.service_order),
        date: text(data.date),
        title: text(data.title),
        equipment: text(data.equipment),
        problem: text(data.problem),
        note: text(data.note),
    };
    const errors = collect({
        customer_id: first(required(task.customer_id, 'customer ID'), maxLength(task.customer_id, 8, 'customer ID')),
        customer_name: first(required(task.customer_name, "customer's name"), maxLength(task.customer_name, 50, "customer's name")),
        service_order: first(required(task.service_order, 'service order'), maxLength(task.service_order, 10, 'service order')),
        date: first(required(task.date, 'date'), isoDate(task.date, 'date')),
        ...validateTaskFields(task),
    });
    if (errors) return { errors };

    // Re-read the chosen loaners so names, categories and availability come from the database.
    const selected = Array.isArray(data.loaners) ? data.loaners : [];
    const records = await getLoanersByIds(selected.map((l) => Number(l.id)).filter(Number.isInteger));
    const unavailable = records.filter((l) => l.status !== LOANER_AVAILABLE);
    if (records.length !== selected.length || unavailable.length) {
        return { errors: { loaners: 'One of the selected loaners is no longer available. Please reload and choose again.' } };
    }
    const loaners = records.map((l) => ({
        ...l,
        note: text(selected.find((s) => Number(s.id) === l.id)?.note).slice(0, 255),
    }));

    await tasks.createTask(task, loaners, user.id);
    revalidatePath('/', 'layout');
    redirect('/dashboard');
}

export async function updateTask(id, data) {
    await requireUser();
    const task = {
        title: text(data.title),
        equipment: text(data.equipment),
        problem: text(data.problem),
        note: text(data.note),
        status_id: text(data.status_id),
    };
    const errors = collect({
        ...validateTaskFields(task),
        status_id: !STATUS_IDS.includes(task.status_id) && 'The selected status is invalid.',
    });
    if (errors) return { errors };

    await tasks.updateTask(Number(id), task);
    revalidatePath('/', 'layout');
    redirect('/dashboard');
}

/** Used by the dashboard's Ready and Complete buttons. */
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
