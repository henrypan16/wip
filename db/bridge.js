// @formatter:off
//NO TRAILING COMMA
// Access database bridge.
//
// Runs under Windows Script Host (32-bit cscript) because the Jet / ACE OLE DB
// providers are only installed as 32-bit on this machine. Node spawns this
// script, writes a JSON request on stdin and reads a JSON response on stdout.
//
// Request:  { connection, transaction, ops: [{ sql, params, scalar }] }
//   - params are bound to `?` placeholders through ADODB.Command, never
//     concatenated into SQL. Dates are passed as { $date: 'yyyy-mm-ddTHH:MM:SS' }.
//   - scalar (optional) is a SQL statement run right after `sql` on the same
//     connection, used for `SELECT @@IDENTITY`.
//   - a parameter of the form { $ref: n } is replaced by the first column of the
//     first row returned by op n, so an insert can use an earlier identity.
// Response: { ok: true, results: [rows, ...] } or { ok: false, error }

var adCmdText = 1;
var adParamInput = 1;
var adInteger = 3;
var adDouble = 5;
var adDate = 7;
var adBoolean = 11;
var adVarWChar = 202;
var adLongVarWChar = 203;

function pad(n) {
	return n < 10 ? "0" + n : "" + n;
}

// Format a JScript Date as local time without a timezone so Node never shifts
// the date when the server and the database disagree about time zones.
function formatDate(d) {
	return (
		d.getFullYear() +
		"-" +
		pad(d.getMonth() + 1) +
		"-" +
		pad(d.getDate()) +
		"T" +
		pad(d.getHours()) +
		":" +
		pad(d.getMinutes()) +
		":" +
		pad(d.getSeconds())
	);
}

function parseDate(s) {
	var m = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2})(?::(\d{2}))?)?$/.exec(
		s
	);
	if (!m) throw new Error("Invalid date parameter: " + s);
	return new Date(
		+m[1],
		+m[2] - 1,
		+m[3],
		+(m[4] || 0),
		+(m[5] || 0),
		+(m[6] || 0)
	).getVarDate();
}

function quote(s) {
	return (
		'"' +
		s.replace(/[\\"\u0000-\u001f]/g, function (c) {
			switch (c) {
				case '"':
					return '\\"';
				case "\\":
					return "\\\\";
				case "\n":
					return "\\n";
				case "\r":
					return "\\r";
				case "\t":
					return "\\t";
				default:
					return (
						"\\u" +
						("0000" + c.charCodeAt(0).toString(16)).slice(-4)
					);
			}
		}) +
		'"'
	);
}

function stringify(v) {
	if (v === null || v === undefined) return "null";
	switch (typeof v) {
		case "string":
			return quote(v);
		case "number":
			return isFinite(v) ? String(v) : "null";
		case "boolean":
			return v ? "true" : "false";
		case "date":
			return quote(formatDate(new Date(v)));
	}
	if (v instanceof Date) return quote(formatDate(v));
	var parts = [],
		k;
	if (v instanceof Array) {
		for (k = 0; k < v.length; k++) parts.push(stringify(v[k]));
		return "[" + parts.join(",") + "]";
	}
	for (k in v) {
		if (v.hasOwnProperty(k)) parts.push(quote(k) + ":" + stringify(v[k]));
	}
	return "{" + parts.join(",") + "}";
}

function readRows(rs) {
	var rows = [];
	if (rs.State === 0) return rows; // statement returned no recordset
	var fields = rs.Fields;
	while (!rs.EOF) {
		var row = {};
		for (var i = 0; i < fields.Count; i++) {
			var f = fields.Item(i);
			var value = f.Value;
			if (value !== null && typeof value === "date")
				value = new Date(value);
			row[f.Name] = value;
		}
		rows.push(row);
		rs.MoveNext();
	}
	return rows;
}

function firstValue(rows) {
	if (!rows || !rows.length)
		throw new Error("Referenced statement returned no rows");
	for (var k in rows[0]) {
		if (rows[0].hasOwnProperty(k)) return rows[0][k];
	}
	throw new Error("Referenced statement returned no columns");
}

function bind(cmd, params, results) {
	for (var i = 0; params && i < params.length; i++) {
		var p = params[i],
			param;
		if (p !== null && typeof p === "object" && p.$ref !== undefined)
			p = firstValue(results[p.$ref]);
		if (p === null || p === undefined) {
			param = cmd.CreateParameter("", adVarWChar, adParamInput, 1, null);
		} else if (typeof p === "string") {
			param = cmd.CreateParameter(
				"",
				p.length > 255 ? adLongVarWChar : adVarWChar,
				adParamInput,
				Math.max(p.length, 1),
				p
			);
		} else if (typeof p === "boolean") {
			param = cmd.CreateParameter("", adBoolean, adParamInput, 0, p);
		} else if (typeof p === "number") {
			param =
				Math.floor(p) === p && Math.abs(p) < 2147483648
					? cmd.CreateParameter("", adInteger, adParamInput, 0, p)
					: cmd.CreateParameter("", adDouble, adParamInput, 0, p);
		} else if (p.$date) {
			param = cmd.CreateParameter(
				"",
				adDate,
				adParamInput,
				0,
				parseDate(p.$date)
			);
		} else {
			throw new Error("Unsupported parameter at index " + i);
		}
		cmd.Parameters.Append(param);
	}
}

function run(conn, sql, params, results) {
	var cmd = new ActiveXObject("ADODB.Command");
	cmd.ActiveConnection = conn;
	cmd.CommandType = adCmdText;
	cmd.CommandText = sql;
	bind(cmd, params, results);
	var rs = cmd.Execute();
	var rows = readRows(rs);
	if (rs.State !== 0) rs.Close();
	return rows;
}

function main() {
	var conn = null;
	var inTransaction = false;

	try {
		var input = WScript.StdIn.ReadAll();

		// Remove BOM if present.
		if (input.charCodeAt(0) === 0xfeff) {
			input = input.substring(1);
		}

		var req = eval("(" + input + ")");

		conn = new ActiveXObject("ADODB.Connection");
		conn.CursorLocation = 3;
		conn.Open(req.connection);

		if (req.transaction) {
			conn.BeginTrans();
			inTransaction = true;
		}

		var results = [];

		for (var i = 0; i < req.ops.length; i++) {
			var op = req.ops[i];

			var rows = run(conn, op.sql, op.params, results);

			if (op.scalar) {
				rows = run(conn, op.scalar, [], results);
			}

			results.push(rows);
		}

		if (inTransaction) {
			conn.CommitTrans();
			inTransaction = false;
		}

		WScript.StdOut.Write(
			stringify({
				ok: true,
				results: results
			})
		);
	} catch (e) {
		if (inTransaction && conn !== null) {
			try {
				conn.RollbackTrans();
			} catch (ignored) {}
		}

		WScript.StdOut.Write(
			stringify({
				ok: false,
				error: {
					code: e.number || 0,
					message: e.description || e.message || String(e)
				}
			})
		);
	} finally {
		if (conn !== null) {
			try {
				if (conn.State) {
					conn.Close();
				}
			} catch (ignored) {}
		}
	}
}

main();
