// Creates a login for the web app. There is no self-registration, so a
// supervisor issues credentials with this script.
//
//   npm run user:create

import { createInterface } from "node:readline/promises";
import bcrypt from "bcryptjs";
import { date, insert, query } from "../lib/access.js";

async function main() {
	const rl = createInterface({ input: process.stdin, output: process.stdout });
	const name = (await rl.question("Name: ")).trim();
	const email = (await rl.question("Email: ")).trim();
	const password = await rl.question("Password (min 8 characters): ");
	rl.close();

	if (!name || !email) throw new Error("Name and email are required.");
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
		throw new Error("The email must be a valid email address.");
	if (password.length < 8)
		throw new Error("The password must be at least 8 characters.");
	const existing = await query("SELECT ID FROM Users WHERE Email = ?", [email]);
	if (existing.length > 0) throw new Error(`${email} already has an account.`);

	// Local time, like the rest of the app.
	const d = new Date();
	const now = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
		.toISOString()
		.slice(0, 19);
	const id = await insert(
		"INSERT INTO Users (Name, Email, [Password], CreatedAt) VALUES (?, ?, ?, ?)",
		[name, email, await bcrypt.hash(password, 12), date(now)],
	);
	console.log(`Created user #${id} (${email}).`);
}

main().catch((error) => {
	console.error(`Could not create user: ${error.message}`);
	process.exit(1);
});
