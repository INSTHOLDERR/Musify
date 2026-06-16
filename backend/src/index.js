import express from "express";
import dotenv from "dotenv";
import { clerkMiddleware } from "@clerk/express";
import fileUpload from "express-fileupload";
import path from "path";
import cors from "cors";
import fs from "fs";
import { createServer } from "http";
import cron from "node-cron";
import dns from "dns";
import cors from "cors";

app.use(
  cors({
    origin: "https://musifyyy-iauk.onrender.com",
    credentials: true,
  })
);


import { initializeSocket } from "./lib/socket.js";
import { connectDB } from "./lib/db.js";
import userRoutes from "./routes/user.route.js";
import adminRoutes from "./routes/admin.route.js";
import authRoutes from "./routes/auth.route.js";
import songRoutes from "./routes/song.route.js";
import albumRoutes from "./routes/album.route.js";
import statRoutes from "./routes/stat.route.js";

dotenv.config();
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const __dirname = path.resolve();
const app = express();
const PORT = process.env.PORT || 5000;

const httpServer = createServer(app);
initializeSocket(httpServer);

const allowedOrigins = [
	"http://localhost:3000",
	"http://localhost:5173",
	"http://localhost:4173",
	...(process.env.CLIENT_URL ? [process.env.CLIENT_URL] : []),
];

app.use(cors({
	origin: (origin, callback) => {
		if (!origin) return callback(null, true);
		if (allowedOrigins.includes(origin)) return callback(null, true);
		callback(new Error(`CORS blocked: ${origin}`));
	},
	credentials: true,
}));

app.use(express.json());
app.use(clerkMiddleware());
app.use(fileUpload({
	useTempFiles: true,
	tempFileDir: path.join(__dirname, "tmp"),
	createParentPath: true,
	limits: { fileSize: 10 * 1024 * 1024 },
}));

const tempDir = path.join(process.cwd(), "tmp");
cron.schedule("0 * * * *", () => {
	if (!fs.existsSync(tempDir)) return;
	fs.readdir(tempDir, (err, files) => {
		if (err) return console.error("Temp cleanup error:", err.message);
		for (const file of files) {
			fs.unlink(path.join(tempDir, file), (err) => {
				if (err) console.error("Delete error:", err.message);
			});
		}
	});
});

app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/stats", statRoutes);

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "../frontend/dist")));
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "../frontend", "dist", "index.html"));
	});
}

app.use((err, req, res, next) => {
	console.error("Server Error:", err.message);
	res.status(500).json({
		message: process.env.NODE_ENV === "production" ? "Internal server error" : err.message,
	});
});

httpServer.listen(PORT, () => {
	console.log(`🚀 Server running on port ${PORT}`);
	connectDB();
});
