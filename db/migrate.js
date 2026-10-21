// Applies the schema changes the web app needs to the Access database.
//
//   npm run db:migrate
//
// Each migration runs once and is recorded in the SchemaMigrations table, so the
// script is safe to re-run. The database file is copied to
// <name>.bak-<timestamp> before anything is changed.

import { copyFileSync, existsSync } from "node:fs";
import path from "node:path";
import { batch, query, date } from "../lib/access.js";

const migrations = [
	{
		name: "001_create_users",
		// Replaces the Laravel `users` table. Passwords are bcrypt hashes.
		sql: [
			`CREATE TABLE Users (
                ID COUNTER CONSTRAINT PK_Users PRIMARY KEY,
                Name TEXT(255) NOT NULL,
                Email TEXT(255) NOT NULL,
                [Password] TEXT(255) NOT NULL,
                CreatedAt DATETIME
            )`,
			"CREATE UNIQUE INDEX UX_Users_Email ON Users (Email)",
		],
	},
	{
		name: "002_tasks_web_columns",
		// Fields the web app tracks that the original Tasks table did not have.
		// Note is widened from 75 characters because the web form uses a textarea.
		sql: [
			"ALTER TABLE Tasks ADD COLUMN Title TEXT(100)",
			"ALTER TABLE Tasks ADD COLUMN ServiceOrder TEXT(10)",
			"ALTER TABLE Tasks ADD COLUMN UserID LONG",
			"ALTER TABLE Tasks ALTER COLUMN [Note] TEXT(255)",
			"ALTER TABLE Tasks ADD CONSTRAINT FK_Tasks_Users FOREIGN KEY (UserID) REFERENCES Users (ID)",
		],
	},
	{
		name: "003_loaners_category_id",
		// Loaners.CategoryID was created as TEXT; it must be numeric to join Category.ID.
		// Loaners.Status keeps its meaning: '0' available, '-1' discontinued,
		// otherwise the CustomerID currently holding the loaner.
		sql: [
			"ALTER TABLE Loaners ALTER COLUMN CategoryID LONG NOT NULL",
			"ALTER TABLE Loaners ADD CONSTRAINT FK_Loaners_Category FOREIGN KEY (CategoryID) REFERENCES Category (ID)",
			"CREATE INDEX IX_Loaners_Status ON Loaners (Status)",
		],
	},
	{
		name: "004_create_task_loaners",
		// Replaces the Laravel `loaner_task` pivot table.
		sql: [
			`CREATE TABLE TaskLoaners (
                ID COUNTER CONSTRAINT PK_TaskLoaners PRIMARY KEY,
                TaskNumber LONG NOT NULL CONSTRAINT FK_TaskLoaners_Tasks REFERENCES Tasks ([Number]),
                LoanerID LONG NOT NULL CONSTRAINT FK_TaskLoaners_Loaners REFERENCES Loaners (ID),
                [Note] TEXT(255)
            )`,
			"CREATE UNIQUE INDEX UX_TaskLoaners ON TaskLoaners (TaskNumber, LoanerID)",
		],
	},
	{
		name: "005_seed_categories",
		// The loaner categories shown on the dashboard.
		sql: [
			"Backpack Computers",
			"Tower Computers",
			"Laser Printers",
			"Thermal Printers",
		].map((name) => ({
			sql: "INSERT INTO Category (Name) SELECT ? FROM (SELECT COUNT(*) FROM Category) WHERE NOT EXISTS (SELECT 1 FROM Category WHERE Name = ?)",
			params: [name, name],
		})),
	},
	{
		name: "006_seed_loaners",
		// The loaner pool from the asset list. Only the name and category map onto
		// the Loaners table; all start available (Status '0').
		sql: [
			[
				"Backpack Computers",
				[
					"BP PC #A",
					"BP PC #B",
					"BP PC #C",
					"BP PC #D",
					"BP PC #E",
					"BP PC #F",
					"BP PC #X",
				],
			],
			[
				"Tower Computers",
				[
					"Tower PC #01",
					"Tower PC #02",
					"Tower PC #03",
					"Tower PC #04",
					"Tower PC #05",
					"Tower PC #06",
					"Tower PC #07",
					"Tower PC #08",
				],
			],
			[
				"Laser Printers",
				[
					"MS811 #01",
					"MS811 #02",
					"MS811 #03",
					"MS811 #04",
					"MS811 #05",
					"MS811 #06",
					"MS811 #07",
					"MS811 #08",
					"MS811 #09",
					"MS811 #10",
					"MS811 #X",
				],
			],
			[
				"Thermal Printers",
				[
					"GK420d #1A",
					"GK420d #1B",
					"Tigra v1 #2A",
					"Tigra v1 #2B",
					"Tigra v1 #3A",
					"Tigra v1 #3B",
					"Tigra v1 #4A",
					"Tigra v1 #4B",
				],
			],
			["Document Scanner", ["PS283 #1", "PS283 #2", "PS188 #1"]],
		].flatMap(([category, names]) =>
			names.map((name) => ({
				// Jet ignores `?` inside the subquery here, so keep the params outside it.
				sql: `INSERT INTO Loaners (Loaner, CategoryID, Status)
                  SELECT ?, c.ID, '0' FROM Category AS c
                  WHERE c.Name = ? AND ? NOT IN (SELECT Loaner FROM Loaners)`,
				params: [name, category, name],
			})),
		),
	},
	{
		name: "007_category_active",
		// Only active categories are shown on the dashboard. New categories default to active.
		sql: ["ALTER TABLE Category ADD COLUMN Active BIT DEFAULT -1"],
	},
	{
		name: "008_retire_tower_computers",
		// Kept apart from 007 so the schema change is committed before rows are written.
		// Tower computers are retired: the category is hidden and every loaner discontinued.
		sql: [
			{
				sql: "UPDATE Category SET Active = ? WHERE Name <> ?",
				params: [true, "Tower Computers"],
			},
			{
				sql: "UPDATE Category SET Active = ? WHERE Name = ?",
				params: [false, "Tower Computers"],
			},
			{
				sql: `UPDATE Loaners AS l INNER JOIN Category AS c ON l.CategoryID = c.ID
                      SET l.Status = ? WHERE c.Name = ?`,
				params: ["-1", "Tower Computers"],
			},
			...[
				"BaseLevel Computer",
				"Document Scanner",
				"Barcode Scanner",
				"Monitor",
				"Power Adapter",
				"USB Hub",
				"USB Fax Modem",
			].map((name) => ({
				// Jet mis-binds a second `?` in the SELECT list, so Active is a literal.
				sql: "INSERT INTO Category (Name, Active) SELECT ?, True FROM (SELECT COUNT(*) FROM Category) WHERE NOT EXISTS (SELECT 1 FROM Category WHERE Name = ?)",
				params: [name, name],
			})),
		],
	},
	{
		name: "009_seed_baselevel_loaners",
		sql: ["BL PC #1", "BL PC #2", "BL PC #3", "BL PC #4", "BL PC #5"].map(
			(name) => ({
				// Jet ignores `?` inside the subquery here, so keep the params outside it.
				sql: `INSERT INTO Loaners (Loaner, CategoryID, Status)
                  SELECT ?, c.ID, '0' FROM Category AS c
                  WHERE c.Name = ? AND ? NOT IN (SELECT Loaner FROM Loaners)`,
				params: [name, "BaseLevel Computer", name],
			}),
		),
	},
	{
		name: "010_seed_printer_supplies",
		// One toner, imaging unit and maintenance kit per laser printer, numbered
		// to match it: MS811 #01 -> Toner #01, Imaging Unit #01, Maintenance Kit #01.
		sql: [
			{
				sql: "INSERT INTO Category (Name, Active) SELECT ?, True FROM (SELECT COUNT(*) FROM Category) WHERE NOT EXISTS (SELECT 1 FROM Category WHERE Name = ?)",
				params: ["Printer Supplies", "Printer Supplies"],
			},
			...["Toner", "Imaging Unit", "Maintenance Kit"].flatMap((supply) =>
				Array.from({ length: 10 }, (_, i) => {
					const name = `${supply} #${String(i + 1).padStart(2, "0")}`;
					return {
						// Jet ignores `?` inside the subquery here, so keep the params outside it.
						sql: `INSERT INTO Loaners (Loaner, CategoryID, Status)
                  SELECT ?, c.ID, '0' FROM Category AS c
                  WHERE c.Name = ? AND ? NOT IN (SELECT Loaner FROM Loaners)`,
						params: [name, "Printer Supplies", name],
					};
				}),
			),
		],
	},
];

async function appliedMigrations() {
	try {
		const rows = await query("SELECT Name FROM SchemaMigrations");
		return new Set(rows.map((r) => r.Name));
	} catch {
		await query(
			"CREATE TABLE SchemaMigrations (Name TEXT(100) CONSTRAINT PK_SchemaMigrations PRIMARY KEY, AppliedAt DATETIME NOT NULL)",
		);
		return new Set();
	}
}

function backup() {
	const file = path.resolve(
		process.cwd(),
		process.env.ACCESS_DB_PATH || "../devdb.mdb",
	);
	if (!existsSync(file)) throw new Error(`Database not found: ${file}`);
	const stamp = new Date()
		.toISOString()
		.replace(/[-:]/g, "")
		.replace(/\..*/, "");
	const target = `${file}.bak-${stamp}`;
	copyFileSync(file, target);
	console.log(`Backed up ${file} to ${target}`);
}

function now() {
	const d = new Date();
	const pad = (n) => String(n).padStart(2, "0");
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

async function main() {
	const applied = await appliedMigrations();
	const pending = migrations.filter((m) => !applied.has(m.name));
	if (pending.length === 0) {
		console.log("Database is up to date.");
		return;
	}

	backup();
	for (const migration of pending) {
		const ops = migration.sql.map((s) =>
			typeof s === "string" ? { sql: s } : s,
		);
		ops.push({
			sql: "INSERT INTO SchemaMigrations (Name, AppliedAt) VALUES (?, ?)",
			params: [migration.name, date(now())],
		});
		await batch(ops, { transaction: true });
		console.log(`Applied ${migration.name}`);
	}
}

main().catch((error) => {
	console.error(`Migration failed: ${error.message}`);
	process.exit(1);
});
