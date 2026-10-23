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

// --- Loaner pool -------------------------------------------------------------

const numbered = (prefix, ids) => ids.map((id) => `${prefix} #${id}`);
const range = (count, width = 1) =>
	Array.from({ length: count }, (_, i) => String(i + 1).padStart(width, "0"));
// Accessories are numbered like their main item: "BP PC #A" -> "BP Power Adapter #A".
const accessoryOf = (main, kind) => main.replace(/( PC)? #/, ` ${kind} #`);

const backpacks = numbered("BP PC", ["A", "B", "C", "D", "E", "F", "X"]);
const baseLevels = numbered("BL PC", range(1));
const laserPrinters = numbered("MS811", range(10, 2));
const thermalPrinters = [
	...numbered("GK420d", ["A", "B"]),
	...numbered("Tigra v1", ["C", "D", "E", "F", "G", "H"]),
];
const documentScanners = ["PS283 #1", "PS283 #2", "PS188 #1"];
const monitors = numbered("Monitor", range(4));

// Main items by category. Barcode Scanner has no loaners yet but is shown on
// the dashboard.
const LOANERS = {
	"Backpack Computers": backpacks,
	"BaseLevel Computer": baseLevels,
	"Laser Printers": [...laserPrinters, "MS811 #X"],
	"Thermal Printers": thermalPrinters,
	"Document Scanner": documentScanners,
	"Barcode Scanner": [],
	Monitor: monitors,
	"USB Hub": numbered("USB Hub", range(4)),
	"USB Fax Modem": numbered("USB Fax Modem", range(4)),
};

// [main, accessory] pairs by accessory category. Each accessory is grouped with
// its main item. Laser printers get one of each supply of the same number:
// MS811 #01 -> Toner #01, Imaging Unit #01, Maintenance Kit #01.
const ACCESSORIES = {
	"Power Adapter": [
		...backpacks,
		...baseLevels,
		...documentScanners,
		...thermalPrinters,
		...monitors,
	].map((main) => [main, accessoryOf(main, "Power Adapter")]),
	"Printer Supplies": laserPrinters.flatMap((main) =>
		["Toner", "Imaging Unit", "Maintenance Kit"].map((supply) => [
			main,
			main.replace("MS811", supply),
		]),
	),
	Cables: [
		...thermalPrinters.map((main) => [main, accessoryOf(main, "USB Cable")]),
		...monitors.map((main) => [main, accessoryOf(main, "HDMI Cable")]),
	],
};

// Seeding statements. Each one skips rows that already exist, so seeding is
// safe against a database that already has some of the pool.
// Jet ignores `?` inside the NOT IN subqueries, so the params stay outside them.

const seedCategory = (name) => ({
	// Jet mis-binds a second `?` in the SELECT list, so Active is a literal.
	sql: "INSERT INTO Category (Name, Active) SELECT ?, True FROM (SELECT COUNT(*) FROM Category) WHERE NOT EXISTS (SELECT 1 FROM Category WHERE Name = ?)",
	params: [name, name],
});

// New loaners start available (Status NULL).
const seedLoaner = (category, name) => ({
	sql: `INSERT INTO Loaners (Loaner, CategoryID)
	      SELECT ?, c.ID FROM Category AS c
	      WHERE c.Name = ? AND ? NOT IN (SELECT Loaner FROM Loaners)`,
	params: [name, category, name],
});

// An accessory starts in the same state as its main item.
const seedAccessory = (category, main, name) => [
	{
		sql: `INSERT INTO Loaners (Loaner, CategoryID, Status)
		      SELECT ?, c.ID, m.Status FROM Category AS c, Loaners AS m
		      WHERE c.Name = ? AND m.Loaner = ? AND ? NOT IN (SELECT Loaner FROM Loaners)`,
		params: [name, category, main, name],
	},
	{
		sql: `INSERT INTO LoanerGroups (MainLoanerID, AccessoryLoanerID)
		      SELECT m.ID, a.ID FROM Loaners AS m, Loaners AS a
		      WHERE m.Loaner = ? AND a.Loaner = ? AND a.ID NOT IN (SELECT AccessoryLoanerID FROM LoanerGroups)`,
		params: [main, name],
	},
];

// --- Migrations --------------------------------------------------------------

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
		name: "003_loaners_columns",
		// Loaners.CategoryID was created as TEXT; it must be numeric to join Category.ID.
		// Loaners.Status is widened from 4 characters to hold service order numbers.
		sql: [
			"ALTER TABLE Loaners ALTER COLUMN CategoryID LONG NOT NULL",
			"ALTER TABLE Loaners ADD CONSTRAINT FK_Loaners_Category FOREIGN KEY (CategoryID) REFERENCES Category (ID)",
			"ALTER TABLE Loaners ALTER COLUMN Status TEXT(10)",
			"CREATE INDEX IX_Loaners_Status ON Loaners (Status)",
		],
	},
	{
		name: "004_merge_loaner_note_into_status",
		// Loaners.Status now holds everything: blank (NULL) available, '-1'
		// discontinued, otherwise the service order number the loaner is out
		// with. That number used to be in Note (sometimes as 'SO#123456') while
		// Status held '0' (available) or the customer ID.
		sql: [
			`UPDATE Loaners
			 SET Status = IIf(Len(Trim([Note] & '')) = 0, NULL,
			                  Left(IIf(Left(Trim([Note]), 3) = 'SO#', Mid(Trim([Note]), 4), Trim([Note])), 10))
			 WHERE Status <> '-1'`,
		],
	},
	{
		name: "005_drop_loaner_note",
		// Kept apart from 004 so the data is committed before the column goes.
		sql: ["ALTER TABLE Loaners DROP COLUMN [Note]"],
	},
	{
		name: "006_create_task_loaners",
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
		name: "007_create_loaner_groups",
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
		name: "008_category_active",
		// Only active categories are shown on the dashboard. New categories default to active.
		sql: ["ALTER TABLE Category ADD COLUMN Active BIT DEFAULT -1"],
	},
	{
		name: "009_seed_loaners",
		// Kept apart from 008 so the schema change is committed before rows are written.
		// The default does not reach existing categories, so they are activated here.
		sql: [
			"UPDATE Category SET Active = True WHERE Active IS NULL",
			...[...Object.keys(LOANERS), ...Object.keys(ACCESSORIES)].map(
				seedCategory,
			),
			...Object.entries(LOANERS).flatMap(([category, names]) =>
				names.map((name) => seedLoaner(category, name)),
			),
			...Object.entries(ACCESSORIES).flatMap(([category, pairs]) =>
				pairs.flatMap(([main, name]) => seedAccessory(category, main, name)),
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
