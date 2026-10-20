'use server';

import { revalidatePath } from 'next/cache';
import { updateLoanerNote } from '@/lib/data/loaners';
import { requireUser } from '@/lib/session';
import { text } from '@/lib/validation';

export async function saveLoanerNote(id, note) {
    await requireUser();
    await updateLoanerNote(Number(id), text(note).slice(0, 255));
    revalidatePath('/', 'layout');
}
