import { clerkClient, getAuth } from "@clerk/express";
import { User } from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
	const { userId } = getAuth(req);
	if (!userId) return res.status(401).json({ message: "Unauthorized - you must be logged in" });

	// Check if user is blocked in our DB
	const dbUser = await User.findOne({ clerkId: userId }).lean();
	if (dbUser?.isBlocked) {
		return res.status(403).json({ message: "BLOCKED", blocked: true });
	}

	next();
};

export const requireAdmin = async (req, res, next) => {
	try {
		const { userId } = getAuth(req);
		if (!userId) return res.status(401).json({ message: "Unauthorized" });
		const currentUser = await clerkClient.users.getUser(userId);
		const isAdmin = process.env.ADMIN_EMAIL === currentUser.primaryEmailAddress?.emailAddress;
		if (!isAdmin) return res.status(403).json({ message: "Unauthorized - admin only" });
		next();
	} catch (error) {
		next(error);
	}
};
