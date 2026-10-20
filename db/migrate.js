// Applies the schema changes the web app needs to the Access database.
//
//   npm run db:migrate
//
// Each migration runs once and is recorded in the SchemaMigrations table, so the
// script is safe to re-run. The database file is copied to
// <name>.bak-<timestamp> before anything is changed.

import { copyFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { batch, query, date } from '../src/lib/access.js';

const migrations = [
    {
        name: '001_create_users',
        // Replaces the Laravel `users` table. Passwords are bcrypt hashes.
        sql: [
            `CREATE TABLE Users (
                ID COUNTER CONSTRAINT PK_Users PRIMARY KEY,
                Name TEXT(255) NOT NULL,
                Email TEXT(255) NOT NULL,
                [Password] TEXT(255) NOT NULL,
                CreatedAt DATETIME
            )`,
            'CREATE UNIQUE INDEX UX_Users_Email ON Users (Email)',
        ],
    },
    {
        name: '002_tasks_web_columns',
        // Fields the web app tracks that the original Tasks table did not have.
        // Note is widened from 75 characters because the web form uses a textarea.
        sql: [
            'ALTER TABLE Tasks ADD COLUMN Title TEXT(100)',
            'ALTER TABLE Tasks ADD COLUMN ServiceOrder TEXT(10)',
            'ALTER TABLE Tasks ADD COLUMN UserID LONG',
            'ALTER TABLE Tasks ALTER COLUMN [Note] TEXT(255)',
            'ALTER TABLE Tasks ADD CONSTRAINT FK_Tasks_Users FOREIGN KEY (UserID) REFERENCES Users (ID)',
        ],
    },
    {
        name: '003_loaners_category_id',
        // Loaners.CategoryID was created as TEXT; it must be numeric to join Category.ID.
        // Loaners.Status keeps its meaning: '0' available, '-1' discontinued,
        // otherwise the CustomerID currently holding the loaner.
        sql: [
            'ALTER TABLE Loaners ALTER COLUMN CategoryID LONG NOT NULL',
            'ALTER TABLE Loaners ADD CONSTRAINT FK_Loaners_Category FOREIGN KEY (CategoryID) REFERENCES Category (ID)',
            'CREATE INDEX IX_Loaners_Status ON Loaners (Status)',
        ],
    },
    {
        name: '004_create_task_loaners',
        // Replaces the Laravel `loaner_task` pivot table.
        sql: [
            `CREATE TABLE TaskLoaners (
                ID COUNTER CONSTRAINT PK_TaskLoaners PRIMARY KEY,
                TaskNumber LONG NOT NULL CONSTRAINT FK_TaskLoaners_Tasks REFERENCES Tasks ([Number]),
                LoanerID LONG NOT NULL CONSTRAINT FK_TaskLoaners_Loaners REFERENCES Loaners (ID),
                [Note] TEXT(255)
            )`,
            'CREATE UNIQUE INDEX UX_TaskLoaners ON TaskLoaners (TaskNumber, LoanerID)',
        ],
    },
    {
        name: '005_seed_categories',
        // The loaner categories shown on the dashboard.
        sql: ['Backpack Computers', 'Tower Computers', 'Laser Printers', 'Thermal Printers'].map((name) => ({
            sql: 'INSERT INTO Category (Name) SELECT ? FROM (SELECT COUNT(*) FROM Category) WHERE NOT EXISTS (SELECT 1 FROM Category WHERE Name = ?)',
            params: [name, name],
        })),
    },
];

async function appliedMigrations() {
    try {
        const rows = await query('SELECT Name FROM SchemaMigrations');
        return new Set(rows.map((r) => r.Name));
    } catch {
        await query('CREATE TABLE SchemaMigrations (Name TEXT(100) CONSTRAINT PK_SchemaMigrations PRIMARY KEY, AppliedAt DATETIME NOT NULL)');
        return new Set();
    }
}

function backup() {
    const file = path.resolve(process.cwd(), process.env.ACCESS_DB_PATH || '../devdb.mdb');
    if (!existsSync(file)) throw new Error(`Database not found: ${file}`);
    const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\..*/, '');
    const target = `${file}.bak-${stamp}`;
    copyFileSync(file, target);
    console.log(`Backed up ${file} to ${target}`);
}

function now() {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

async function main() {
    const applied = await appliedMigrations();
    const pending = migrations.filter((m) => !applied.has(m.name));
    if (pending.length === 0) {
        console.log('Database is up to date.');
        return;
    }

    backup();
    for (const migration of pending) {
        const ops = migration.sql.map((s) => (typeof s === 'string' ? { sql: s } : s));
        ops.push({ sql: 'INSERT INTO SchemaMigrations (Name, AppliedAt) VALUES (?, ?)', params: [migration.name, date(now())] });
        await batch(ops, { transaction: true });
        console.log(`Applied ${migration.name}`);
    }
}

main().catch((error) => {
    console.error(`Migration failed: ${error.message}`);
    process.exit(1);
});
