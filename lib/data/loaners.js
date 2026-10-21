import { batch, query, ref } from '../access';
import { LOANER_DISCONTINUED } from '../constants';

const LOANER_COLUMNS = `
    l.ID AS id, l.Loaner AS name, l.CategoryID AS category_id, c.Name AS category,
    l.Status AS status`;

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
 * Loaners not discontinued, to choose from on the task forms. Which of them can
 * be picked depends on the task's SO# (see loanerPick in lib/format).
 * @returns {Promise<import('../types').Loaner[]>}
 */
export async function getLoanersInService() {
    return query(`SELECT ${LOANER_COLUMNS} ${FROM} WHERE (l.Status IS NULL OR l.Status <> ?) ORDER BY l.ID`, [LOANER_DISCONTINUED]);
}

/** @returns {Promise<import('../types').Loaner[]>} */
export async function getLoanersByIds(ids) {
    if (ids.length === 0) return [];
    return query(`SELECT ${LOANER_COLUMNS} ${FROM} WHERE l.ID IN (${ids.map(() => '?').join(', ')})`, ids);
}

/**
 * The loaners linked to a task.
 * @returns {Promise<import('../types').Loaner[]>}
 */
export async function getTaskLoaners(taskId) {
    return query(
        `SELECT ${LOANER_COLUMNS}
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

/**
 * Every main item / accessory link. A main item and its accessories form a
 * group that is lent out together.
 * @returns {Promise<import('../types').LoanerGroupLink[]>}
 */
export async function getLoanerGroupLinks() {
    return query('SELECT MainLoanerID AS main_id, AccessoryLoanerID AS accessory_id FROM LoanerGroups ORDER BY ID');
}

// Make a loaner an accessory of `mainId`, or of nothing when it is null.
function setMainOps(loanerId, mainId) {
    const ops = [{ sql: 'DELETE FROM LoanerGroups WHERE AccessoryLoanerID = ?', params: [loanerId] }];
    if (mainId) ops.push({ sql: 'INSERT INTO LoanerGroups (MainLoanerID, AccessoryLoanerID) VALUES (?, ?)', params: [mainId, loanerId] });
    return ops;
}

/**
 * @param {{name: string, category_id: number, status: string | null, main_id: number | null}} loaner
 * @returns {Promise<number>} the new loaner's ID
 */
export async function createLoaner(loaner) {
    const ops = [{
        sql: 'INSERT INTO Loaners (Loaner, CategoryID, Status) VALUES (?, ?, ?)',
        params: [loaner.name, loaner.category_id, loaner.status],
        scalar: 'SELECT @@IDENTITY AS id',
    }];
    if (loaner.main_id) ops.push({ sql: 'INSERT INTO LoanerGroups (MainLoanerID, AccessoryLoanerID) VALUES (?, ?)', params: [loaner.main_id, ref(0)] });
    const [[{ id }]] = await batch(ops, { transaction: true });
    return id;
}

export async function updateLoaner(id, loaner) {
    await batch([
        { sql: 'UPDATE Loaners SET Loaner = ?, CategoryID = ?, Status = ? WHERE ID = ?', params: [loaner.name, loaner.category_id, loaner.status, id] },
        ...setMainOps(id, loaner.main_id),
    ], { transaction: true });
}

/** Mark a loaner as out with a service order, or available when blank. Discontinued loaners are left alone. */
export async function setLoanerServiceOrder(id, serviceOrder) {
    await query('UPDATE Loaners SET Status = ? WHERE ID = ? AND (Status IS NULL OR Status <> ?)',
        [serviceOrder || null, id, LOANER_DISCONTINUED]);
}
