import { batch, date, likeEscape, query, ref } from '../access';
import { LOANER_AVAILABLE, LOANER_DISCONTINUED, PAGE_SIZE, STATUS } from '../constants';

// Column aliases match the field names the UI used with the Laravel API.
const TASK_COLUMNS = `
    t.[Number] AS id, t.Title AS title, t.[Date] AS [date], t.Problem AS problem,
    t.ServiceOrder AS service_order, t.[Note] AS [note], t.Equipment AS equipment,
    t.CustomerID AS customer_id, t.CustomerName AS customer_name, t.Status AS status_id,
    t.NoteLoaner AS note_loaner, t.NoteLoanerPr AS note_loaner_printer`;

// Loaners lent out with a task, as recorded in the original Access columns.
const loanerSummary = (row) => [row.note_loaner, row.note_loaner_printer].filter(Boolean).join(', ');

/** Every task that is not complete, oldest first, for the dashboard. */
export async function getOpenTasks() {
    return query(
        `SELECT ${TASK_COLUMNS}, s.StatusLabel AS status, u.Name AS [user]
         FROM (Tasks AS t INNER JOIN Status AS s ON t.Status = s.IdStatus)
              LEFT JOIN Users AS u ON t.UserID = u.ID
         WHERE t.Status <> ?
         ORDER BY t.[Number]`,
        [STATUS.COMPLETE],
    );
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

/** One page of tasks, newest first, optionally filtered by a search term and status. */
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

export async function getTask(id) {
    const rows = await query(
        `SELECT ${TASK_COLUMNS}, u.Name AS [user]
         FROM Tasks AS t LEFT JOIN Users AS u ON t.UserID = u.ID
         WHERE t.[Number] = ?`,
        [id],
    );
    return rows[0] ?? null;
}

/** Tasks with the given status, for the printable reports. */
export async function getReportTasks(status) {
    const rows = await query(
        `SELECT ${TASK_COLUMNS} FROM Tasks AS t WHERE t.Status = ? ORDER BY t.[Number]`,
        [status],
    );
    return rows.map((row) => ({ ...row, loaner: loanerSummary(row) }));
}

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
function legacyLoanerColumns(loaners) {
    const describe = (list) => list.map((l) => (l.note ? `${l.name} (${l.note})` : l.name)).join(', ').slice(0, 60) || null;
    const printers = loaners.filter((l) => /printer/i.test(l.category));
    const others = loaners.filter((l) => !/printer/i.test(l.category));
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
    const legacy = legacyLoanerColumns(loaners);
    const ops = [
        {
            sql: `INSERT INTO Tasks (CustomerID, CustomerName, [Date], Title, ServiceOrder, Equipment, Problem, [Note],
                                     Status, UserID, Loaner, NoteLoaner, LoanerPrinter, NoteLoanerPr)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            params: [
                task.customer_id, task.customer_name, date(task.date), task.title, task.service_order,
                task.equipment, task.problem, task.note || null, STATUS.RECEIVED, userId,
                legacy.loaner, legacy.noteLoaner, legacy.loanerPrinter, legacy.noteLoanerPrinter,
            ],
            scalar: 'SELECT @@IDENTITY AS id',
        },
    ];
    for (const loaner of loaners) {
        ops.push(
            { sql: 'INSERT INTO TaskLoaners (TaskNumber, LoanerID, [Note]) VALUES (?, ?, ?)', params: [ref(0), loaner.id, loaner.note || null] },
            { sql: 'UPDATE Loaners SET Status = ? WHERE ID = ?', params: [task.customer_id, loaner.id] },
        );
    }
    const [[{ id }]] = await batch(ops, { transaction: true });
    return id;
}

// Completing a task returns its loaners to the available pool. This uses a
// join because Jet silently ignores parameters inside an UPDATE's subquery.
function releaseLoanersOp(taskId) {
    return {
        sql: `UPDATE Loaners AS l INNER JOIN TaskLoaners AS tl ON l.ID = tl.LoanerID
              SET l.Status = ?
              WHERE tl.TaskNumber = ? AND l.Status <> ?`,
        params: [LOANER_AVAILABLE, taskId, LOANER_DISCONTINUED],
    };
}

export async function updateTask(id, task) {
    const ops = [
        {
            sql: 'UPDATE Tasks SET Title = ?, Equipment = ?, Problem = ?, [Note] = ?, Status = ? WHERE [Number] = ?',
            params: [task.title, task.equipment, task.problem, task.note || null, task.status_id, id],
        },
    ];
    if (task.status_id === STATUS.COMPLETE) ops.push(releaseLoanersOp(id));
    await batch(ops, { transaction: true });
}

export async function setTaskStatus(id, status) {
    const ops = [{ sql: 'UPDATE Tasks SET Status = ? WHERE [Number] = ?', params: [status, id] }];
    if (status === STATUS.COMPLETE) ops.push(releaseLoanersOp(id));
    await batch(ops, { transaction: true });
}
