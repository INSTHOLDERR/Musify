import { User } from "../models/user.model.js";
import { Message } from "../models/message.model.js";
import { getAuth } from "@clerk/express";


// 👥 GET ALL USERS
export const getAllUsers = async (req, res, next) => {
	try {
		const { userId: currentUserId } = getAuth(req);

		if (!currentUserId) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		const users = await User.find({
			clerkId: { $ne: currentUserId },
		}).lean();

		res.status(200).json(users);
	} catch (error) {
		console.error("getAllUsers Error:", error.message);
		next(error);
	}
};



// 💬 GET MESSAGES
export const getMessages = async (req, res, next) => {
	try {
		const { userId: myId } = getAuth(req);
		const { userId } = req.params;

		if (!myId) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		if (!userId) {
			return res.status(400).json({ message: "User ID is required" });
		}

		const messages = await Message.find({
			$or: [
				{ senderId: userId, receiverId: myId },
				{ senderId: myId, receiverId: userId },
			],
		})
			.sort({ createdAt: 1 })
			.lean();

		res.status(200).json(messages);
	} catch (error) {
		console.error("getMessages Error:", error.message);
		next(error);
	}
};