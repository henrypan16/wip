import { format } from 'date-fns';
import { batch, date, insert, query } from '../access';

const USER_COLUMNS = 'ID AS id, Name AS name, Email AS email, [Password] AS [password]';

export async function findUserByEmail(email) {
    const rows = await query(`SELECT ${USER_COLUMNS} FROM Users WHERE Email = ?`, [email]);
    return rows[0] ?? null;
}

export async function findUserById(id) {
    const rows = await query(`SELECT ${USER_COLUMNS} FROM Users WHERE ID = ?`, [id]);
    return rows[0] ?? null;
}

export async function createUser({ name, email, passwordHash }) {
    const now = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss");
    return insert('INSERT INTO Users (Name, Email, [Password], CreatedAt) VALUES (?, ?, ?, ?)', [name, email, passwordHash, date(now)]);
}

export async function updateUser(id, { name, email }) {
    await query('UPDATE Users SET Name = ?, Email = ? WHERE ID = ?', [name, email, id]);
}

export async function updateUserPassword(id, passwordHash) {
    await query('UPDATE Users SET [Password] = ? WHERE ID = ?', [passwordHash, id]);
}

/** Delete a user, keeping their tasks but clearing who received them. */
export async function deleteUser(id) {
    await batch(
        [
            { sql: 'UPDATE Tasks SET UserID = NULL WHERE UserID = ?', params: [id] },
            { sql: 'DELETE FROM Users WHERE ID = ?', params: [id] },
        ],
        { transaction: true },
    );
}

/**
 * Everyone who can receive a task, for the task forms.
 * @returns {Promise<import('../types').User[]>}
 */
export async function getUsers() {
    return query('SELECT ID AS id, Name AS name FROM Users ORDER BY Name');
}
