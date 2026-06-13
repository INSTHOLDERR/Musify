import mongoose from "mongoose";

export const connectDB = async () => {
	try {
		if (!process.env.MONGODB_URI) {
			throw new Error("❌ MONGODB_URI is missing in .env");
		}

		const conn = await mongoose.connect(process.env.MONGODB_URI, {
			serverSelectionTimeoutMS: 5000, // ⏱ fail fast if DB not reachable
		});

		console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
	} catch (error) {
		console.error("❌ MongoDB connection failed:", error.message);
		process.exit(1);
	}
};