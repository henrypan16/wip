'use server';

import { revalidatePath } from 'next/cache';
import { LOANER_DISCONTINUED } from '@/lib/constants';
import * as loaners from '@/lib/data/loaners';
import { loanerGroups } from '@/lib/loanerGroups';
import { requireUser } from '@/lib/session';
import { collect, first, maxLength, required, text } from '@/lib/validation';

const digits = (value) => text(value).replace(/\D/g, '').slice(0, 10);

/** The dashboard card's SO#: the service order the loaner is out with, or blank when available. */
export async function saveLoanerServiceOrder(id, serviceOrder) {
    await requireUser();
    await loaners.setLoanerServiceOrder(Number(id), digits(serviceOrder));
    revalidatePath('/', 'layout');
}

// The form sends a state and, when in use, the SO#; both are stored in Status.
// `main_id` makes the loaner an accessory in that main item's group.
// Field sizes come from the Loaners table in the Access database.
async function validateLoaner(data, exceptId = 0) {
    const name = text(data.name);
    const categoryId = Number(data.category_id);
    const state = text(data.state);
    const serviceOrder = digits(data.service_order);
    const mainId = Number(data.main_id) || null;
    const [categories, links, main] = await Promise.all([
        loaners.getCategories(),
        loaners.getLoanerGroupLinks(),
        mainId ? loaners.getLoaner(mainId) : null,
    ]);
    const { accessoriesOf, mainOf } = loanerGroups(links);
    const errors = collect({
        name: first(
            required(name, 'name'),
            maxLength(name, 255, 'name'),
            await loaners.loanerNameTaken(name, exceptId) && 'A loaner with this name already exists.',
        ),
        category_id: !categories.some((c) => c.id === categoryId) && 'The selected category is invalid.',
        state: !['available', 'used', 'discontinued'].includes(state) && 'The selected status is invalid.',
        service_order: state === 'used' && !serviceOrder && 'Enter the service order the loaner is out with.',
        main_id: mainId && first(
            !main && 'The selected main item no longer exists.',
            mainId === exceptId && "A loaner can't be its own accessory.",
            mainOf.has(mainId) && `${main?.name} is itself an accessory. Choose its main item instead.`,
            accessoriesOf.has(exceptId) && 'This loaner is the main item of a group, so it cannot be an accessory.',
        ),
    });
    const status = { available: null, used: serviceOrder, discontinued: LOANER_DISCONTINUED }[state] ?? null;
    return { loaner: { name, category_id: categoryId, status, main_id: mainId }, errors };
}

export async function createLoaner(data) {
    await requireUser();
    const { loaner, errors } = await validateLoaner(data);
    if (errors) return { errors };

    await loaners.createLoaner(loaner);
    revalidatePath('/', 'layout');
    return { saved: true };
}

export async function updateLoaner(id, data) {
    await requireUser();
    const current = await loaners.getLoaner(Number(id));
    if (!current) return { errors: { name: 'This loaner no longer exists. Please reload the page.' } };

    const { loaner, errors } = await validateLoaner(data, current.id);
    if (errors) return { errors };

    await loaners.updateLoaner(current.id, loaner);
    revalidatePath('/', 'layout');
    return { saved: true };
}
