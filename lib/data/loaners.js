import { query } from '../access';
import { LOANER_AVAILABLE, LOANER_DISCONTINUED } from '../constants';

const LOANER_COLUMNS = `
    l.ID AS id, l.Loaner AS name, l.CategoryID AS category_id, c.Name AS category,
    l.Status AS status, l.[Note] AS [note]`;

const FROM = 'FROM Loaners AS l INNER JOIN Category AS c ON l.CategoryID = c.ID';

export async function getLoaners() {
    return query(`SELECT ${LOANER_COLUMNS} ${FROM} ORDER BY l.ID`);
}

/** Loaners still in service, for the dashboard. */
export async function getActiveLoaners() {
    return query(`SELECT ${LOANER_COLUMNS} ${FROM} WHERE l.Status <> ? ORDER BY l.ID`, [LOANER_DISCONTINUED]);
}

/** Loaners that can be lent out with a new task. */
export async function getAvailableLoaners() {
    return query(`SELECT ${LOANER_COLUMNS} ${FROM} WHERE l.Status = ? ORDER BY l.ID`, [LOANER_AVAILABLE]);
}

export async function getLoanersByIds(ids) {
    if (ids.length === 0) return [];
    return query(`SELECT ${LOANER_COLUMNS} ${FROM} WHERE l.ID IN (${ids.map(() => '?').join(', ')})`, ids);
}

export async function getCategories() {
    return query('SELECT ID AS id, Name AS name FROM Category ORDER BY Name');
}

export async function updateLoanerNote(id, note) {
    await query('UPDATE Loaners SET [Note] = ? WHERE ID = ?', [note || null, id]);
}
