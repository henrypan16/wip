import { insert, query } from '../access';
import { LOANER_AVAILABLE } from '../constants';

const LOANER_COLUMNS = `
    l.ID AS id, l.Loaner AS name, l.CategoryID AS category_id, c.Name AS category,
    l.Status AS status, l.[Note] AS [note]`;

const FROM = 'FROM Loaners AS l INNER JOIN Category AS c ON l.CategoryID = c.ID';

/** @returns {Promise<import('../types').Loaner[]>} */
export async function getLoaners() {
    return query(`SELECT ${LOANER_COLUMNS} ${FROM} ORDER BY l.ID`);
}

/**
 * Loaners in an active category, discontinued ones included, for the dashboard.
 * @returns {Promise<import('../types').Loaner[]>}
 */
export async function getDashboardLoaners() {
    return query(`SELECT ${LOANER_COLUMNS} ${FROM} WHERE c.Active = True ORDER BY l.ID`);
}

/** @returns {Promise<import('../types').Loaner | undefined>} */
export async function getLoaner(id) {
    const [loaner] = await query(`SELECT ${LOANER_COLUMNS} ${FROM} WHERE l.ID = ?`, [id]);
    return loaner;
}

/** Whether another loaner already uses this name. */
export async function loanerNameTaken(name, exceptId = 0) {
    const rows = await query('SELECT ID FROM Loaners WHERE Loaner = ? AND ID <> ?', [name, exceptId]);
    return rows.length > 0;
}

/**
 * Loaners that can be lent out with a new task.
 * @returns {Promise<import('../types').Loaner[]>}
 */
export async function getAvailableLoaners() {
    return query(`SELECT ${LOANER_COLUMNS} ${FROM} WHERE l.Status = ? ORDER BY l.ID`, [LOANER_AVAILABLE]);
}

/** @returns {Promise<import('../types').Loaner[]>} */
export async function getLoanersByIds(ids) {
    if (ids.length === 0) return [];
    return query(`SELECT ${LOANER_COLUMNS} ${FROM} WHERE l.ID IN (${ids.map(() => '?').join(', ')})`, ids);
}

/**
 * The loaners linked to a task, with the note they were lent out with in place of the loaner's own note.
 * @returns {Promise<import('../types').Loaner[]>}
 */
export async function getTaskLoaners(taskId) {
    return query(
        `SELECT l.ID AS id, l.Loaner AS name, l.CategoryID AS category_id, c.Name AS category,
                l.Status AS status, tl.[Note] AS [note]
         FROM (TaskLoaners AS tl INNER JOIN Loaners AS l ON tl.LoanerID = l.ID)
              INNER JOIN Category AS c ON l.CategoryID = c.ID
         WHERE tl.TaskNumber = ? ORDER BY l.ID`,
        [taskId],
    );
}

/** @returns {Promise<import('../types').Category[]>} */
export async function getCategories() {
    return query('SELECT ID AS id, Name AS name, Active AS active FROM Category ORDER BY Name');
}

/**
 * Categories shown on the dashboard, oldest first.
 * @returns {Promise<import('../types').Category[]>}
 */
export async function getActiveCategories() {
    return query('SELECT ID AS id, Name AS name, Active AS active FROM Category WHERE Active = True ORDER BY ID');
}

/** @returns {Promise<number>} the new loaner's ID */
export async function createLoaner(loaner) {
    return insert('INSERT INTO Loaners (Loaner, CategoryID, Status, [Note]) VALUES (?, ?, ?, ?)',
        [loaner.name, loaner.category_id, loaner.status, loaner.note || null]);
}

export async function updateLoaner(id, loaner) {
    await query('UPDATE Loaners SET Loaner = ?, CategoryID = ?, Status = ?, [Note] = ? WHERE ID = ?',
        [loaner.name, loaner.category_id, loaner.status, loaner.note || null, id]);
}

export async function updateLoanerNote(id, note) {
    await query('UPDATE Loaners SET [Note] = ? WHERE ID = ?', [note || null, id]);
}
