import { batch, date, likeEscape, query, ref } from '../access';
import { PAGE_SIZE, PRINTER_CATEGORIES, STATUS } from '../constants';
import { loanerGroups } from '../loanerGroups';
import { getLoanerGroupLinks } from './loaners';

// Column aliases match the field names the UI used with the Laravel API.
const TASK_COLUMNS = `
    t.[Number] AS id, t.[Date] AS [date], t.Problem AS problem,
    t.ServiceOrder AS service_order, t.[Note] AS [note], t.Equipment AS equipment,
    t.CustomerID AS customer_id, t.CustomerName AS customer_name, t.Status AS status_id,
    t.NoteLoaner AS note_loaner, t.NoteLoanerPr AS note_loaner_printer`;

// Loaners lent out with a task, as recorded in the original Access columns.
const loanerSummary = (row) => [row.note_loaner, row.note_loaner_printer].filter(Boolean).join(', ');

/**
 * Every task that is not complete, oldest first, for the dashboard.
 * @returns {Promise<import('../types').Task[]>}
 */
export async function getOpenTasks() {
    const rows = await query(
        `SELECT ${TASK_COLUMNS}, s.StatusLabel AS status, u.Name AS [user]
         FROM (Tasks AS t INNER JOIN Status AS s ON t.Status = s.IdStatus)
              LEFT JOIN Users AS u ON t.UserID = u.ID
         WHERE t.Status <> ?
         ORDER BY t.[Number]`,
        [STATUS.COMPLETE],
    );
    return rows.map((row) => ({ ...row, loaner: loanerSummary(row) }));
}

function searchFilter({ search, status }) {
    const clauses = [];
    const params = [];
    if (search) {
        const term = `%${likeEscape(search)}%`;
        const columns = ['t.CustomerID', 't.CustomerName', 't.ServiceOrder', 't.Equipment', 't.Problem', 't.[Note]'];
        clauses.push(`(${columns.map((c) => `${c} LIKE ?`).join(' OR ')})`);
        params.push(...columns.map(() => term));
    }
    if (status) {
        clauses.push('t.Status = ?');
        params.push(status);
    }
    return { where: clauses.length ? `WHERE ${clauses.join(' AND ')}` : '', params };
}

/**
 * One page of tasks, newest first, optionally filtered by a search term and status.
 * @returns {Promise<import('../types').TaskPage>}
 */
export async function getTaskPage({ page = 1, search = '', status = '' } = {}) {
    const { where, params } = searchFilter({ search, status });
    const offset = (page - 1) * PAGE_SIZE;

    // Jet SQL has no OFFSET. Take the first offset + PAGE_SIZE rows, then the
    // last PAGE_SIZE of those by reversing the order twice.
    const [rows, [{ total }]] = await batch([
        {
            sql: `SELECT * FROM (
                      SELECT TOP ${PAGE_SIZE} * FROM (
                          SELECT TOP ${offset + PAGE_SIZE} ${TASK_COLUMNS} FROM Tasks AS t ${where} ORDER BY t.[Number] DESC
                      ) AS firstRows ORDER BY firstRows.id
                  ) AS pageRows ORDER BY pageRows.id DESC`,
            params,
        },
        { sql: `SELECT COUNT(*) AS total FROM Tasks AS t ${where}`, params },
    ]);

    // On the last page the inner query returns fewer than offset + PAGE_SIZE
    // rows, so the outer TOP also picked up rows from the previous page.
    const onPage = Math.max(0, Math.min(PAGE_SIZE, total - offset));

    return {
        data: rows.slice(rows.length - onPage).map((row) => ({ ...row, loaner: loanerSummary(row) })),
        total,
        currentPage: page,
        lastPage: Math.max(1, Math.ceil(total / PAGE_SIZE)),
    };
}

/** @returns {Promise<import('../types').Task | null>} */
export async function getTask(id) {
    const rows = await query(
        `SELECT ${TASK_COLUMNS}, t.UserID AS user_id, u.Name AS [user]
         FROM Tasks AS t LEFT JOIN Users AS u ON t.UserID = u.ID
         WHERE t.[Number] = ?`,
        [id],
    );
    return rows[0] ? { ...rows[0], loaner: loanerSummary(rows[0]) } : null;
}

/**
 * Tasks with the given status, for the printable reports.
 * @returns {Promise<import('../types').Task[]>}
 */
export async function getReportTasks(status) {
    const rows = await query(
        `SELECT ${TASK_COLUMNS} FROM Tasks AS t WHERE t.Status = ? ORDER BY t.[Number]`,
        [status],
    );
    return rows.map((row) => ({ ...row, loaner: loanerSummary(row) }));
}

/** @returns {Promise<import('../types').Status[]>} */
export async function getStatuses() {
    return query('SELECT IdStatus AS id, StatusLabel AS name FROM Status ORDER BY IdStatus');
}

/** The pharmacy name used on the customer's most recent task. */
export async function findCustomerName(customerId) {
    const rows = await query(
        'SELECT TOP 1 CustomerName AS name FROM Tasks WHERE CustomerID = ? ORDER BY [Number] DESC',
        [customerId],
    );
    return rows[0]?.name ?? null;
}

// The original Access forms track loaners with two Yes/No flags and notes on the
// task itself. Fill those in too so the existing Access queries keep working.
//
// Only main items are recorded: an accessory whose main item is on the same task
// is left out. Laser and thermal printers go in LoanerPrinter / NoteLoanerPr,
// everything else in Loaner / NoteLoaner. The note columns are TEXT(60).
async function legacyLoanerColumns(loaners) {
    const { mainOf } = loanerGroups(await getLoanerGroupLinks());
    const ids = new Set(loaners.map((l) => l.id));
    const mains = loaners.filter((l) => !ids.has(mainOf.get(l.id)));
    const describe = (list) => list.map((l) => l.name).join(', ').slice(0, 60) || null;
    const printers = mains.filter((l) => PRINTER_CATEGORIES.includes(l.category));
    const others = mains.filter((l) => !PRINTER_CATEGORIES.includes(l.category));
    return {
        loaner: others.length > 0,
        noteLoaner: describe(others),
        loanerPrinter: printers.length > 0,
        noteLoanerPrinter: describe(printers),
    };
}

/**
 * Create a task and lend it the given loaners, all in one transaction.
 * @param {object} task validated task fields
 * @param {{id: number, name: string, category: string, note: string}[]} loaners
 */
export async function createTask(task, loaners, userId) {
    const legacy = await legacyLoanerColumns(loaners);
    const ops = [
        {
            sql: `INSERT INTO Tasks (CustomerID, CustomerName, [Date], ServiceOrder, Equipment, Problem, [Note],
                                     Status, UserID, Loaner, NoteLoaner, LoanerPrinter, NoteLoanerPr)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            params: [
                task.customer_id, task.customer_name, date(task.date), task.service_order,
                task.equipment, task.problem, task.note || null, STATUS.RECEIVED, userId,
                legacy.loaner, legacy.noteLoaner, legacy.loanerPrinter, legacy.noteLoanerPrinter,
            ],
            scalar: 'SELECT @@IDENTITY AS id',
        },
    ];
    for (const loaner of loaners) ops.push(...lendLoanerOps(ref(0), loaner, task));
    const [[{ id }]] = await batch(ops, { transaction: true });
    return id;
}

// Link a loaner to a task and mark it out with the task's service order, which
// the dashboard shows as SO#000000.
function lendLoanerOps(taskId, loaner, task) {
    return [
        { sql: 'INSERT INTO TaskLoaners (TaskNumber, LoanerID) VALUES (?, ?)', params: [taskId, loaner.id] },
        { sql: 'UPDATE Loaners SET Status = ? WHERE ID = ?', params: [task.service_order, loaner.id] },
    ];
}

// Completing a task makes its loaners available again. Only loaners still out
// under the task's service order are released, so a loaner since lent with
// another task (or discontinued) is left alone. This uses joins because Jet
// silently ignores parameters inside an UPDATE's subquery.
function releaseLoanersOp(taskId) {
    return {
        sql: `UPDATE (Loaners AS l INNER JOIN TaskLoaners AS tl ON l.ID = tl.LoanerID)
                     INNER JOIN Tasks AS t ON tl.TaskNumber = t.[Number]
              SET l.Status = NULL
              WHERE tl.TaskNumber = ? AND l.Status = t.ServiceOrder`,
        params: [taskId],
    };
}

/**
 * Save an edited task and its loaner changes in one transaction.
 * @param {number} id
 * @param {object} task validated task fields
 * @param {{
 *   loaners: {id: number, name: string, category: string, note: string}[],
 *   added: {id: number, note: string}[],
 *   removed: {id: number, release: boolean}[],
 *   held: number[],
 * }} changes `loaners` is the task's full list afterwards; `release` marks removed
 *   loaners still out under the task's old SO#; `held` are kept loaners still out under it.
 */
export async function updateTask(id, task, { loaners, added, removed, held }) {
    const legacy = await legacyLoanerColumns(loaners);
    const ops = [
        {
            sql: `UPDATE Tasks SET Equipment = ?, Problem = ?, [Note] = ?, Status = ?, ServiceOrder = ?, UserID = ?,
                                   Loaner = ?, NoteLoaner = ?, LoanerPrinter = ?, NoteLoanerPr = ?
                  WHERE [Number] = ?`,
            params: [
                task.equipment, task.problem, task.note || null, task.status_id, task.service_order, task.user_id,
                legacy.loaner, legacy.noteLoaner, legacy.loanerPrinter, legacy.noteLoanerPrinter, id,
            ],
        },
    ];
    for (const loaner of removed) {
        ops.push({ sql: 'DELETE FROM TaskLoaners WHERE TaskNumber = ? AND LoanerID = ?', params: [id, loaner.id] });
        if (loaner.release) {
            ops.push({ sql: 'UPDATE Loaners SET Status = NULL WHERE ID = ?', params: [loaner.id] });
        }
    }
    for (const loaner of added) ops.push(...lendLoanerOps(id, loaner, task));
    // Loaners still out with the task follow it to its new SO#.
    for (const loanerId of held) {
        ops.push({ sql: 'UPDATE Loaners SET Status = ? WHERE ID = ?', params: [task.service_order, loanerId] });
    }
    if (task.status_id === STATUS.COMPLETE) ops.push(releaseLoanersOp(id));
    await batch(ops, { transaction: true });
}

/** A completed task can only have its note changed. */
export async function updateTaskNote(id, note) {
    await query('UPDATE Tasks SET [Note] = ? WHERE [Number] = ?', [note || null, id]);
}

/**
 * Mark a task complete. Its loaners go back to the available pool with their
 * notes cleared, ready for the next customer.
 */
export async function completeTask(id) {
    await batch([
        { sql: 'UPDATE Tasks SET Status = ? WHERE [Number] = ?', params: [STATUS.COMPLETE, id] },
        releaseLoanersOp(id),
    ], { transaction: true });
}

export async function setTaskStatus(id, status) {
    const ops = [{ sql: 'UPDATE Tasks SET Status = ? WHERE [Number] = ?', params: [status, id] }];
    if (status === STATUS.COMPLETE) ops.push(releaseLoanersOp(id));
    await batch(ops, { transaction: true });
}
