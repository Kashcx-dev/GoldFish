import pool from "./middlewares/db.js";

async function addColumn() {
	try {
		await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS token_count INTEGER DEFAULT 1000;");
		console.log("Successfully added token_count column to users table!");
	} catch (error) {
		console.error("Error adding column:", error.message);
	} finally {
		process.exit(0);
	}
}

addColumn();
