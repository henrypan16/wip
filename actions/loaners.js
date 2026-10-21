'use server';

import { revalidatePath } from 'next/cache';
import { LOANER_AVAILABLE, LOANER_DISCONTINUED } from '@/lib/constants';
import * as loaners from '@/lib/data/loaners';
import { requireUser } from '@/lib/session';
import { collect, first, maxLength, required, text } from '@/lib/validation';

/** The dashboard card's note: the service order number the loaner went out with, or blank. */
export async function saveLoanerNote(id, serviceOrder) {
    await requireUser();
    await loaners.updateLoanerNote(Number(id), text(serviceOrder).replace(/\D/g, '').slice(0, 10));
    revalidatePath('/', 'layout');
}

// Field sizes come from the Loaners table in the Access database.
// `allowedStatuses` is what the status may be set to; a loaner out with a
// customer can only stay with them or be discontinued.
async function validateLoaner(data, allowedStatuses, exceptId = 0) {
    const loaner = {
        name: text(data.name),
        category_id: Number(data.category_id),
        status: text(data.status),
        note: text(data.note),
    };
    const categories = await loaners.getCategories();
    const errors = collect({
        name: first(
            required(loaner.name, 'name'),
            maxLength(loaner.name, 255, 'name'),
            await loaners.loanerNameTaken(loaner.name, exceptId) && 'A loaner with this name already exists.',
        ),
        category_id: !categories.some((c) => c.id === loaner.category_id) && 'The selected category is invalid.',
        status: !allowedStatuses.includes(loaner.status) && 'The selected status is invalid.',
        note: maxLength(loaner.note, 255, 'note'),
    });
    return { loaner, errors };
}

export async function createLoaner(data) {
    await requireUser();
    const { loaner, errors } = await validateLoaner(data, [LOANER_AVAILABLE, LOANER_DISCONTINUED]);
    if (errors) return { errors };

    await loaners.createLoaner(loaner);
    revalidatePath('/', 'layout');
    return { saved: true };
}

export async function updateLoaner(id, data) {
    await requireUser();
    const current = await loaners.getLoaner(Number(id));
    if (!current) return { errors: { name: 'This loaner no longer exists. Please reload the page.' } };

    const allowed = current.status === LOANER_AVAILABLE || current.status === LOANER_DISCONTINUED
        ? [LOANER_AVAILABLE, LOANER_DISCONTINUED]
        : [current.status, LOANER_DISCONTINUED];
    const { loaner, errors } = await validateLoaner(data, allowed, current.id);
    if (errors) return { errors };

    await loaners.updateLoaner(current.id, loaner);
    revalidatePath('/', 'layout');
    return { saved: true };
}
