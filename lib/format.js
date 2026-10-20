import { format, parseISO } from 'date-fns';

/** Customer IDs are stored as 4-digit zero padded text, e.g. '0451'. */
export const padCustomerId = (id) => ('000' + (id ?? '')).slice(-4);

/** Format a 'yyyy-mm-ddTHH:MM:SS' value from the database as dd/MM/yyyy. */
export function formatDate(value) {
    if (!value) return '';
    return format(parseISO(value), 'dd/MM/yyyy');
}

/** Today's date as yyyy-mm-dd, the value format of <input type="date">. */
export const today = () => format(new Date(), 'yyyy-MM-dd');
