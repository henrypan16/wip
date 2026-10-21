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
		// Loaners.Status keeps its meaning (until 012): '0' available, '-1' discontinued,
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
	{
		name: "011_widen_loaner_status",
		// Loaners.Status is about to hold service order numbers, which need more
		// than 4 characters. The index has to be dropped to change the column.
		sql: [
			"DROP INDEX IX_Loaners_Status ON Loaners",
			"ALTER TABLE Loaners ALTER COLUMN Status TEXT(10)",
			"CREATE INDEX IX_Loaners_Status ON Loaners (Status)",
		],
	},
	{
		name: "012_merge_loaner_note_into_status",
		// Loaners.Status now holds everything: blank (NULL) available, '-1'
		// discontinued, otherwise the service order number the loaner is out
		// with. That number used to be in Note (sometimes as 'SO#123456') while
		// Status held '0' or the customer ID.
		sql: [
			`UPDATE Loaners
			 SET Status = IIf(Len(Trim([Note] & '')) = 0, NULL,
			                  Left(IIf(Left(Trim([Note]), 3) = 'SO#', Mid(Trim([Note]), 4), Trim([Note])), 10))
			 WHERE Status <> '-1'`,
		],
	},
	{
		name: "013_drop_loaner_note",
		sql: ["ALTER TABLE Loaners DROP COLUMN [Note]"],
	},
	{
		name: "014_create_loaner_groups",
		// Loaners that go out together: one row per accessory, linked to the
		// group's main item. An accessory belongs to at most one group.
		sql: [
			`CREATE TABLE LoanerGroups (
				ID COUNTER CONSTRAINT PK_LoanerGroups PRIMARY KEY,
				MainLoanerID LONG NOT NULL CONSTRAINT FK_LoanerGroups_Main REFERENCES Loaners (ID),
				AccessoryLoanerID LONG NOT NULL CONSTRAINT FK_LoanerGroups_Accessory REFERENCES Loaners (ID)
			)`,
			"CREATE UNIQUE INDEX UX_LoanerGroups_Accessory ON LoanerGroups (AccessoryLoanerID)",
			"CREATE INDEX IX_LoanerGroups_Main ON LoanerGroups (MainLoanerID)",
		],
	},
	{
		name: "015_seed_power_adapters_and_groups",
		// A power adapter for each computer, document scanner and thermal printer,
		// numbered like its device and grouped with it. Each adapter starts in
		// the same state as its device. Laser printers are grouped with the
		// supplies of the same number.
		sql: (() => {
			const adapters = [
				...["A", "B", "C", "D", "E", "F", "X"].map((n) => [`BP PC #${n}`, `BP Power Adapter #${n}`]),
				...["1", "2", "3", "4", "5"].map((n) => [`BL PC #${n}`, `BL Power Adapter #${n}`]),
				...["1", "2"].map((n) => [`PS283 #${n}`, `PS283 Power Adapter #${n}`]),
				["PS188 #1", "PS188 Power Adapter #1"],
				...["1A", "1B"].map((n) => [`GK420d #${n}`, `GK420d Power Adapter #${n}`]),
				...["2A", "2B", "3A", "3B", "4A", "4B"].map((n) => [`Tigra v1 #${n}`, `Tigra v1 Power Adapter #${n}`]),
			];
			const supplies = Array.from({ length: 10 }, (_, i) => String(i + 1).padStart(2, "0")).flatMap((n) =>
				["Toner", "Imaging Unit", "Maintenance Kit"].map((supply) => [`MS811 #${n}`, `${supply} #${n}`]),
			);
			// Jet ignores `?` inside these subqueries, so keep the params outside them.
			const createAdapter = ([device, adapter]) => ({
				sql: `INSERT INTO Loaners (Loaner, CategoryID, Status)
				      SELECT ?, c.ID, d.Status FROM Category AS c, Loaners AS d
				      WHERE c.Name = 'Power Adapter' AND d.Loaner = ? AND ? NOT IN (SELECT Loaner FROM Loaners)`,
				params: [adapter, device, adapter],
			});
			const link = ([main, accessory]) => ({
				sql: `INSERT INTO LoanerGroups (MainLoanerID, AccessoryLoanerID)
				      SELECT m.ID, a.ID FROM Loaners AS m, Loaners AS a
				      WHERE m.Loaner = ? AND a.Loaner = ? AND a.ID NOT IN (SELECT AccessoryLoanerID FROM LoanerGroups)`,
				params: [main, accessory],
			});
			return [...adapters.map(createAdapter), ...adapters.map(link), ...supplies.map(link)];
		})(),
	},
	{
		name: "016_seed_hubs_modems_monitors_cables",
		// Five each of USB hubs, fax modems and monitors; each monitor grouped
		// with its own power adapter. A new Cables category with a USB cable for
		// each thermal printer, grouped with that printer.
		sql: (() => {
			const numbers = ["1", "2", "3", "4", "5"];
			const thermal = ["GK420d #1A", "GK420d #1B", "Tigra v1 #2A", "Tigra v1 #2B", "Tigra v1 #3A", "Tigra v1 #3B", "Tigra v1 #4A", "Tigra v1 #4B"];
			const loaners = [
				...numbers.map((n) => ["USB Hub", `USB Hub #${n}`]),
				...numbers.map((n) => ["USB Fax Modem", `USB Fax Modem #${n}`]),
				...numbers.map((n) => ["Monitor", `Monitor #${n}`]),
				...numbers.map((n) => ["Power Adapter", `Monitor Power Adapter #${n}`]),
				...thermal.map((printer) => ["Cables", printer.replace(" #", " USB Cable #")]),
			];
			const groups = [
				...numbers.map((n) => [`Monitor #${n}`, `Monitor Power Adapter #${n}`]),
				...thermal.map((printer) => [printer, printer.replace(" #", " USB Cable #")]),
			];
			// Jet ignores `?` inside these subqueries, so keep the params outside them.
			return [
				{
					// Jet mis-binds a second `?` in the SELECT list, so Active is a literal.
					sql: "INSERT INTO Category (Name, Active) SELECT ?, True FROM (SELECT COUNT(*) FROM Category) WHERE NOT EXISTS (SELECT 1 FROM Category WHERE Name = ?)",
					params: ["Cables", "Cables"],
				},
				...loaners.map(([category, name]) => ({
					sql: `INSERT INTO Loaners (Loaner, CategoryID)
					      SELECT ?, c.ID FROM Category AS c
					      WHERE c.Name = ? AND ? NOT IN (SELECT Loaner FROM Loaners)`,
					params: [name, category, name],
				})),
				...groups.map(([main, accessory]) => ({
					sql: `INSERT INTO LoanerGroups (MainLoanerID, AccessoryLoanerID)
					      SELECT m.ID, a.ID FROM Loaners AS m, Loaners AS a
					      WHERE m.Loaner = ? AND a.Loaner = ? AND a.ID NOT IN (SELECT AccessoryLoanerID FROM LoanerGroups)`,
					params: [main, accessory],
				})),
			];
		})(),
	},
	{
		name: "017_seed_monitor_hdmi_cables",
		// An HDMI cable for each monitor, numbered like it and grouped with it.
		sql: ["1", "2", "3", "4", "5"].flatMap((n) => [
			{
				// Jet ignores `?` inside the subquery here, so keep the params outside it.
				sql: `INSERT INTO Loaners (Loaner, CategoryID)
				      SELECT ?, c.ID FROM Category AS c
				      WHERE c.Name = 'Cables' AND ? NOT IN (SELECT Loaner FROM Loaners)`,
				params: [`Monitor HDMI Cable #${n}`, `Monitor HDMI Cable #${n}`],
			},
			{
				sql: `INSERT INTO LoanerGroups (MainLoanerID, AccessoryLoanerID)
				      SELECT m.ID, a.ID FROM Loaners AS m, Loaners AS a
				      WHERE m.Loaner = ? AND a.Loaner = ? AND a.ID NOT IN (SELECT AccessoryLoanerID FROM LoanerGroups)`,
				params: [`Monitor #${n}`, `Monitor HDMI Cable #${n}`],
			},
		]),
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
