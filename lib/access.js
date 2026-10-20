import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';

// Thin client for the Access database. Every call spawns cscript running
// db/bridge.js, which executes the statements through ADODB and returns JSON.
// Parameters are bound with `?` placeholders, never concatenated into SQL.
//
// Jet quirk: in UPDATE statements, `?` inside a subquery is silently ignored
// (the statement matches nothing). Use an UPDATE ... INNER JOIN instead.
// Subquery parameters work as expected in SELECT and INSERT ... SELECT.

const BRIDGE = path.join(/*turbopackIgnore: true*/ process.cwd(), 'db', 'bridge.js');

function cscriptPath() {
    if (process.env.ACCESS_CSCRIPT) return process.env.ACCESS_CSCRIPT;
    const root = process.env.SystemRoot || process.env.windir || 'C:\\Windows';
    // Jet/ACE are 32-bit on this machine, so use the 32-bit script host.
    return path.join(root, 'SysWOW64', 'cscript.exe');
}

function connectionString() {
    const provider = process.env.ACCESS_PROVIDER || 'Microsoft.Jet.OLEDB.4.0';
    const file = path.resolve(/*turbopackIgnore: true*/ process.cwd(), process.env.ACCESS_DB_PATH || '../devdb.mdb');
    return `Provider=${provider};Data Source=${file}`;
}

/** Wrap a 'yyyy-mm-dd' (or 'yyyy-mm-ddTHH:MM:SS') string so it is bound as a date. */
export const date = (value) => ({ $date: value });

/** Reference the first value returned by an earlier op in the same batch. */
export const ref = (opIndex) => ({ $ref: opIndex });

/** Escape LIKE wildcards so user input is matched literally. */
export const likeEscape = (value) => value.replace(/[[%_]/g, (c) => `[${c}]`);

/**
 * Run several statements in one cscript process.
 * @param {{sql: string, params?: any[], scalar?: string}[]} ops
 * @param {{transaction?: boolean}} options
 * @returns {Promise<object[][]>} the rows returned by each op
 */
export function batch(ops, { transaction = false } = {}) {
    if (!existsSync(BRIDGE)) {
        return Promise.reject(new Error(`Access bridge not found at ${BRIDGE}. Run the app from the web folder.`));
    }
    const request = JSON.stringify({ connection: connectionString(), transaction, ops })
        // JScript treats these as line terminators inside string literals.
        .replace(/\u2028/g, '\\u2028')
        .replace(/\u2029/g, '\\u2029');

    return new Promise((resolve, reject) => {
        const child = spawn(/*turbopackIgnore: true*/ cscriptPath(), ['//E:JScript', '//Nologo', '//U', BRIDGE], { windowsHide: true });
        const stdout = [];
        const stderr = [];
        child.stdout.on('data', (d) => stdout.push(d));
        child.stderr.on('data', (d) => stderr.push(d));
        child.on('error', reject);
        child.on('close', (code) => {
            const text = Buffer.concat(stdout).toString('utf16le');
            if (!text) {
                const detail = Buffer.concat(stderr).toString('utf16le').trim();
                return reject(new Error(`Access bridge exited with code ${code}${detail ? `: ${detail}` : ''}`));
            }
            let response;
            try {
                response = JSON.parse(text);
            } catch {
                return reject(new Error(`Access bridge returned invalid output: ${text.slice(0, 200)}`));
            }
            if (!response.ok) {
                const error = new Error(response.error.message);
                error.code = response.error.code;
                return reject(error);
            }
            resolve(response.results);
        });
        child.stdin.end(Buffer.from(request, 'utf16le'));
    });
}

/** Run a single statement and return its rows. */
export async function query(sql, params = []) {
    const [rows] = await batch([{ sql, params }]);
    return rows;
}

/** Run an INSERT and return the new AutoNumber value. */
export async function insert(sql, params = []) {
    const [rows] = await batch([{ sql, params, scalar: 'SELECT @@IDENTITY AS id' }]);
    return rows[0].id;
}
