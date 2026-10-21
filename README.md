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

## Project layout

- `app/**/page.tsx` – one per route (TypeScript). Server-rendered markup lives in the page itself;
  client components used by only that page sit next to it (e.g. `app/(main)/dashboard/TaskBoard.tsx`).
- `app/(main)/MainLayout.tsx` – the signed-in shell: navbar, sidebar and content area.
- `components/` – only components shared by more than one page (form fields, tables, modal, status badge).
- `actions/` – server actions; `lib/data/` – SQL for each table; `lib/types.ts` – row types.

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
| Seed `Loaners`: 5 backpack PCs, 8 tower PCs, 9 MS811 laser printers, 8 GK420d/Tigra thermal printers, all available | Initial loaner pool |
| `Category`: add `Active` (Yes/No, default Yes); Tower Computers inactive and its loaners discontinued | Only active categories show on the dashboard |
| Seed categories BaseLevel Computer, Document Scanner, Barcode Scanner, Monitor, Power Adapter, USB Hub, USB Fax Modem, Printer Supplies, with BL PCs and printer supplies | Loaner pool |
| `Loaners.Status`: widen 4 → 10, take the SO# from `Note`, then drop `Note` | One field for a loaner's state |
| New `LoanerGroups` table (`MainLoanerID`, `AccessoryLoanerID` unique, both → `Loaners.ID`) | Loaners that go out together: picking a main item on a task adds its accessories |
| Seed power adapters for each computer, document scanner and thermal printer, grouped with their device; group each MS811 with its toner, imaging unit and maintenance kit | Initial groups |
| Seed 5 USB hubs, 5 USB fax modems and 5 monitors (each grouped with a monitor power adapter); new `Cables` category with a USB cable grouped with each thermal printer | Loaner pool |
| Seed an HDMI cable (in `Cables`) grouped with each monitor | Loaner pool |

Existing tables, columns, data and Access queries are otherwise unchanged. When a task is
created with loaners, the original `Tasks.Loaner` / `NoteLoaner` / `LoanerPrinter` /
`NoteLoanerPr` columns are filled in as well, so the existing Access queries
(`Loaner Query`, `LoanerPrinters Query`, …) keep working.

Values used by the app:

- `Tasks.Status` → `Status.IdStatus`: 1 Received, 2 Pending Repair, 3 Pending Part(s),
  4 Scheduled, **5 Complete**, **6 Ready**, 7 Pending Action, 8 RMA, 9 Recycle.
- `Loaners.Status`: blank (NULL) available, `-1` discontinued, otherwise the service order
  number the loaner is out with. Completing a task clears it on the loaners still out under
  the task's SO#.

Loaners can be added and edited on the `/loaner` page.

## Pages

| Path | |
| --- | --- |
| `/`, `/dashboard` | Pending and ready-to-go task lists, task details (Ready, Complete), loaner groups that expand to show each loaner with an editable SO# |
| `/task` | All tasks: search, status filter, pagination; click a row to edit |
| `/task/create` | New task with loaner selection; pharmacy name fills in from earlier tasks |
| `/task/[id]/edit` | Update equipment, problem, note, status, SO#, received by, loaners |
| `/loaner` | All loaners with search, status and category filters; add and edit loaners |
| `/receive` | Third-party PC intake; generates the inspection log text |
| `/report/ready`, `/report/action`, `/report/repair` | Printable lists |
| `/profile` | Name/email, password, delete account |
| `/login`, `/register` | |
