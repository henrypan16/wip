import { differenceInCalendarDays, format, parseISO } from 'date-fns';
import { LOANER_DISCONTINUED } from './constants';

/** Customer IDs are stored as 4-digit zero padded text, e.g. '0451'. */
export const padCustomerId = (id) => ('000' + (id ?? '')).slice(-4);

/** Keep the digits typed into a fixed-width number field, zero padded on the left: '12' -> '000012'. */
export function padDigits(value, width) {
    const digits = value.replace(/\D/g, '');
    return digits ? digits.padStart(width, '0').slice(-width) : '';
}

/** Service orders are 6-digit numbers, shown as SO#000000. */
export const SERVICE_ORDER_DIGITS = 6;

/**
 * The service order number a loaner is out with, from its status; blank when it
 * is available or discontinued. Older values may still start with 'SO#'.
 * @param {{ status: string | null }} loaner
 */
export function loanerServiceOrder(loaner) {
    const status = (loaner.status ?? '').trim();
    return status === LOANER_DISCONTINUED ? '' : status.replace(/^SO#/i, '');
}

/**
 * A loaner's state from its status: discontinued, used while it holds a
 * service order number, and available when blank.
 * @param {{ status: string | null }} loaner
 * @returns {'available' | 'used' | 'discontinued'}
 */
export function loanerState(loaner) {
    if (loaner.status === LOANER_DISCONTINUED) return 'discontinued';
    return loanerServiceOrder(loaner) ? 'used' : 'available';
}

/** Format a 'yyyy-mm-ddTHH:MM:SS' value from the database as dd/MM/yyyy. */
export function formatDate(value) {
    if (!value) return '';
    return format(parseISO(value), 'dd/MM/yyyy');
}

/**
 * How long ago a database date was, e.g. 'Today', '1 day', '12 days', or '12d' when short.
 * @param {string | null | undefined} value
 * @param {boolean} [short]
 */
export function age(value, short = false) {
    if (!value) return '';
    const days = differenceInCalendarDays(new Date(), parseISO(value));
    if (days <= 0) return 'Today';
    if (short) return `${days}d`;
    return days === 1 ? '1 day' : `${days} days`;
}

/** Today's date as yyyy-mm-dd, the value format of <input type="date">. */
export const today = () => format(new Date(), 'yyyy-MM-dd');

/**
 * Whether a loaner can be lent with a task under `serviceOrder`. Available
 * loaners always can. A used loaner only can when its SO# is this task's
 * ('match'), e.g. one handed out before the task was entered.
 * @param {{ status: string | null }} loaner
 * @param {string} serviceOrder
 * @returns {'available' | 'match' | 'used' | 'discontinued'}
 */
export function loanerPick(loaner, serviceOrder) {
    const state = loanerState(loaner);
    if (state === 'used' && serviceOrder && loanerServiceOrder(loaner) === serviceOrder) return 'match';
    return state;
}
