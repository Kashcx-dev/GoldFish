import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import middlewareHandler, { authLimiter } from "../middlewares/middlewareHandler.js";
import authRoutes from "../routes/auth.js";
import pool from "../middlewares/db.js";

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

// Apply middlewares
middlewareHandler(app);

// Routes (with rate limiting on auth)
app.use("/api/auth", authLimiter, authRoutes);

// Health check
app.get("/api/health", (req, res) => {
	res.json({ message: "Server is running", clientType: req.clientType });
});

// 404 handler
app.use((req, res, next) => {
	res.status(404).json({ success: false, message: "Page not found" });
});

// 500 error handler
app.use((error, req, res, next) => {
	console.error(error);
	res.status(500).json({ success: false, error: error.message });
});

// ─── WebSocket Server (for Electron App) ───
const wss = new WebSocketServer({ server, path: "/ws" });

wss.on("connection", async (ws, req) => {
	// Authenticate the WebSocket connection via JWT in query string
	const url = new URL(req.url, `http://localhost:${PORT}`);
	const token = url.searchParams.get("token");

	if (!token) {
		ws.close(4001, "No token provided");
		return;
	}

	try {
		const decoded = jwt.verify(token, JWT_SECRET);
		ws.userId = decoded.id;
		ws.isAlive = true;

		// Fetch token count for this user
		const result = await pool.query("SELECT token_count FROM users WHERE id = $1", [decoded.id]);
		const tokenCount = result.rows[0]?.token_count ?? 0;

		// Send initial handshake with token info
		ws.send(JSON.stringify({
			type: "connected",
			success: true,
			tokens: tokenCount <= 0 ? null : tokenCount,
			message: tokenCount <= 0 ? "No tokens remaining" : "Connected to GoldFish Server",
		}));

		ws.on("message", (data) => {
			// Future: handle LLM request messages from the Electron app here
			const msg = JSON.parse(data);
			// Echo back for now as a placeholder
			ws.send(JSON.stringify({ type: "ack", received: msg }));
		});

		ws.on("pong", () => { ws.isAlive = true; });

	} catch (error) {
		ws.close(4003, "Invalid token");
	}
});

// Heartbeat to clean up dead connections
const heartbeat = setInterval(() => {
	wss.clients.forEach((ws) => {
		if (!ws.isAlive) return ws.terminate();
		ws.isAlive = false;
		ws.ping();
	});
}, 30000);

wss.on("close", () => clearInterval(heartbeat));

// Start the HTTP + WebSocket server
server.listen(PORT, () => {
	console.log(`Server running on port ${PORT} (HTTP + WebSocket)`);
});
