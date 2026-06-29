import pg from "pg";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool } = pg;

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
});

// Test and Initialize Database
const initDatabase = async () => {
	try {
		// Test connection
		const testRes = await pool.query("SELECT NOW()");
		console.log("Database connected successfully at:", testRes.rows[0].now);

		// Read and execute schema
		const schemaPath = path.join(__dirname, "schema.sql");
		if (fs.existsSync(schemaPath)) {
			const schemaSql = fs.readFileSync(schemaPath, "utf8");
			await pool.query(schemaSql);
			console.log("Database tables and indexes initialized successfully.");
		}
	} catch (err) {
		console.error("Database initialization error:", err.stack);
	}
};

initDatabase();

export default pool;
