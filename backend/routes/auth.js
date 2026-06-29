import express from "express";
import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../db.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

router.post(
	"/signup",
	[
		body("name", "Enter a valid name").isLength({ min: 3 }),
		body("email", "Enter a valid mail").isEmail(),
		body("password", "Password must be of 8 characters").isLength({ min: 8 }),
	],
	async (req, res) => {
		let success = false;
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ success, errors: errors.array() });
		}

		const { name, email, password } = req.body;

		if (!name || !email || !password) {
			return res
				.status(400)
				.json({ success, errors: "please fill all the fields" });
		}

		try {
			const userExists = await pool.query(
				"SELECT * FROM users WHERE email = $1",
				[email],
			);

			if (userExists.rows.length > 0) {
				return res.status(400).json({
					success: false,
					error: "user with this email already exists",
				});
			}

			const salt = await bcrypt.genSalt(10);
			const securedPassword = await bcrypt.hash(password, salt);

			const newUser = await pool.query(
				"INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, created_at",
				[name, email, securedPassword],
			);

			const token = jwt.sign({ id: newUser.rows[0].id }, JWT_SECRET, {
				expiresIn: "7d",
			});

			res.status(201).json({
				success: true,
				message: "signup successful",
				token,
				user: {
					id: newUser.rows[0].id,
					name: newUser.rows[0].name,
					email: newUser.rows[0].email,
				},
			});
		} catch (error) {
			res.status(500).json({ success: false, message: error.message });
		}
	},
);

router.post(
	"/login",
	[
		body("email", "Enter a valid mail").isEmail(),
		body("password", "Password can not be blank").exists(),
	],
	async (req, res) => {
		let success = false;
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ success, errors: errors.array() });
		}

		const { email, password } = req.body;

		try {
			const userResult = await pool.query(
				"SELECT * FROM users WHERE email = $1",
				[email],
			);

			if (userResult.rows.length === 0) {
				return res
					.status(400)
					.json({ success, error: "invalid credentials" });
			}

			const user = userResult.rows[0];

			const isPasswordValid = await bcrypt.compare(
				password,
				user.password_hash,
			);
			if (!isPasswordValid) {
				return res
					.status(400)
					.json({ success, error: "invalid credentials" });
			}

			const token = jwt.sign({ id: user.id }, JWT_SECRET, {
				expiresIn: "7d",
			});

			res.json({
				success: true,
				message: "login successful",
				token,
				user: {
					id: user.id,
					name: user.name,
					email: user.email,
				},
			});
		} catch (error) {
			res.status(500).json({ success: false, message: error.message });
		}
	},
);

// router.get("/getuser", async (req,res) => {
//     try {

//     } catch (error) {

//     }
// })

export default router;
