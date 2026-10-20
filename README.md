# FTWIP – Resource Department

Work-in-progress tracker for the Resource Department: repair tasks, loaner equipment and
third-party PC intake. Next.js (App Router) + Tailwind CSS, storing data in the existing
Microsoft Access database (`devdb.mdb`).

## Requirements

- Windows, with the Microsoft Jet 4.0 / ACE OLE DB provider (ships with Windows; ACE comes with Office).
- Node.js 20.9 or newer.

The Access drivers on this machine are 32-bit only, so the app talks to the database through
`db/bridge.js`, a small JScript program run by the 32-bit `cscript.exe`
(`C:\Windows\SysWOW64\cscript.exe`). No ODBC setup is needed.

## Setup

```sh
cd web
npm install
copy .env.example .env.local   # then set SESSION_SECRET (see the comment in the file)
npm run db:migrate             # one-time schema changes; backs up the .mdb first
npm run dev                    # http://localhost:3000
```

For production: `npm run build` then `npm start` (always from the `web` folder, since the
bridge script and the default database path are resolved from there).

Register the first account at `/register`.

## Configuration (`.env.local`)

| Variable | Default | |
| --- | --- | --- |
| `ACCESS_DB_PATH` | `../devdb.mdb` | Database file, relative to `web/` or absolute |
| `ACCESS_PROVIDER` | `Microsoft.Jet.OLEDB.4.0` | Use `Microsoft.ACE.OLEDB.12.0` for `.accdb` |
| `ACCESS_CSCRIPT` | `C:\Windows\SysWOW64\cscript.exe` | Override if 64-bit ACE is installed |
| `SESSION_SECRET` | – | Required. Signs the login cookie |
| `SESSION_COOKIE_SECURE` | `false` | Set `true` when served over HTTPS |

## Database

`npm run db:migrate` applies these changes once each (recorded in `SchemaMigrations`):

| Change | Why |
| --- | --- |
| New `Users` table (`ID`, `Name`, `Email` unique, `Password` bcrypt hash, `CreatedAt`) | Login accounts (replaces Laravel's `users`) |
| `Tasks`: add `Title`, `ServiceOrder`, `UserID` (→ `Users.ID`); widen `Note` 75 → 255 | Fields the web forms use |
| `Loaners.CategoryID`: TEXT → LONG, foreign key to `Category.ID`; index on `Status` | So loaners can join their category |
| New `TaskLoaners` table (`TaskNumber` → `Tasks.Number`, `LoanerID` → `Loaners.ID`, `Note`) | Loaners lent out with a task (replaces `loaner_task`) |
| Seed `Category`: Backpack Computers, Tower Computers, Laser Printers, Thermal Printers | Loaner sections on the dashboard |

Existing tables, columns, data and Access queries are otherwise unchanged. When a task is
created with loaners, the original `Tasks.Loaner` / `NoteLoaner` / `LoanerPrinter` /
`NoteLoanerPr` columns are filled in as well, so the existing Access queries
(`Loaner Query`, `LoanerPrinters Query`, …) keep working.

Values used by the app:

- `Tasks.Status` → `Status.IdStatus`: 1 Received, 2 Pending Repair, 3 Pending Part(s),
  4 Scheduled, **5 Complete**, **6 Ready**, 7 Pending Action, 8 RMA, 9 Recycle.
- `Loaners.Status`: `0` available, `-1` discontinued, otherwise the CustomerID holding it.
  Completing a task sets its loaners back to `0`.

Loaners are added directly in Access (`Loaners` table: `Loaner` = name, `CategoryID`,
`Status` = `0`).

## Pages

| Path | |
| --- | --- |
| `/`, `/dashboard` | Ready / not-ready tasks, loaner status with editable notes, task details (Ready, Complete) |
| `/task` | All tasks: search, status filter, pagination; click a row to edit |
| `/task/create` | New task with loaner selection; pharmacy name fills in from earlier tasks |
| `/task/[id]/edit` | Update title, equipment, problem, note, status |
| `/loaner` | All loaners with search, status and category filters |
| `/receive` | Third-party PC intake; generates the inspection log text |
| `/report/ready`, `/report/action`, `/report/repair` | Printable lists |
| `/profile` | Name/email, password, delete account |
| `/login`, `/register` | |
