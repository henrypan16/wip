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
 * The service order number in a loaner's note. The note holds just the number;
 * older notes may still start with 'SO#'.
 * @param {string | null | undefined} note
 */
export const loanerServiceOrder = (note) => (note ?? '').trim().replace(/^SO#/i, '');

/**
 * How the dashboard shows a loaner: discontinued by its status, otherwise
 * used while its note holds a service order and available when it is blank.
 * @param {{ status: string, note: string | null }} loaner
 * @returns {'available' | 'used' | 'discontinued'}
 */
export function loanerState(loaner) {
    if (loaner.status === LOANER_DISCONTINUED) return 'discontinued';
    return loanerServiceOrder(loaner.note) ? 'used' : 'available';
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
