import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "./db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_for_dev_only";

// Middleware
app.use(
	cors({
		origin: process.env.FRONTEND_URL || "http://localhost:5173",
		credentials: true,
		allowedHeaders: ["Content-Type", "Authorization"],
		methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
	}),
);
app.use(express.json());

// Test route
app.get("/api/health", (req, res) => {
	res.json({ status: "ok", message: "Server is running" });
});

// Signup route
app.post("/api/signup", async (req, res) => {
	const { name, email, password } = req.body;

	if (!name || !email || !password) {
		return res.status(400).json({ error: "All fields are required" });
	}

	try {
		// 1. Check if user already exists
		const userExist = await pool.query(
			"SELECT * FROM users WHERE email = $1",
			[email],
		);
		if (userExist.rows.length > 0) {
			return res.status(400).json({ error: "Email already registered" });
		}

		// 2. Hash password
		const salt = await bcrypt.genSalt(10);
		const passwordHash = await bcrypt.hash(password, salt);

		// 3. Insert into database
		const newUser = await pool.query(
			"INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, created_at",
			[name, email, passwordHash],
		);

		// 4. Generate JWT
		const token = jwt.sign({ id: newUser.rows[0].id }, JWT_SECRET, {
			expiresIn: "24h",
		});

		res.status(201).json({
			message: "Signup successful",
			token,
			user: {
				id: newUser.rows[0].id,
				name: newUser.rows[0].name,
				email: newUser.rows[0].email,
			},
		});
	} catch (err) {
		console.error("Signup error:", err);
		res.status(500).json({ error: "Server error during registration" });
	}
});

// Login route
app.post("/api/login", async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return res.status(400).json({ error: "Email and password are required" });
	}

	try {
		// 1. Check if user exists
		const userResult = await pool.query(
			"SELECT * FROM users WHERE email = $1",
			[email],
		);
		if (userResult.rows.length === 0) {
			return res.status(400).json({ error: "Invalid credentials" });
		}

		const user = userResult.rows[0];

		// 2. Verify password
		const isMatch = await bcrypt.compare(password, user.password_hash);
		if (!isMatch) {
			return res.status(400).json({ error: "Invalid credentials" });
		}

		// 3. Generate JWT
		const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "24h" });

		res.json({
			message: "Login successful",
			token,
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
			},
		});
	} catch (err) {
		console.error("Login error:", err);
		res.status(500).json({ error: "Server error during login" });
	}
});

// Start Server
app.listen(PORT, () => {
	console.log(`🚀 Express server running on port ${PORT}`);
});
