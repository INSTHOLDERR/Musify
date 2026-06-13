import { Server } from "socket.io";
import { Message } from "../models/message.model.js";

export const initializeSocket = (server) => {
	const io = new Server(server, {
		cors: {
			origin: process.env.CLIENT_URL || "http://localhost:3000",
			credentials: true,
		},
	});

	const userSockets = new Map(); // { userId: socketId }
	const userActivities = new Map(); // { userId: activity }

	io.on("connection", (socket) => {
		console.log("🔌 New socket connected:", socket.id);

		// 👤 USER CONNECTED
		socket.on("user_connected", (userId) => {
			if (!userId) return;

			userSockets.set(userId, socket.id);
			userActivities.set(userId, "Idle");

			// broadcast user connection
			io.emit("user_connected", userId);

			// send updated online users
			io.emit("users_online", Array.from(userSockets.keys()));

			// send activity list
			io.emit("activities", Array.from(userActivities.entries()));
		});

		// 🔄 UPDATE ACTIVITY
		socket.on("update_activity", ({ userId, activity }) => {
			if (!userId) return;

			userActivities.set(userId, activity || "Idle");

			io.emit("activity_updated", { userId, activity });
		});

		// 💬 SEND MESSAGE
		socket.on("send_message", async ({ senderId, receiverId, content }) => {
			try {
				if (!senderId || !receiverId || !content) {
					return socket.emit("message_error", "Invalid message data");
				}

				const message = await Message.create({
					senderId,
					receiverId,
					content,
				});

				// send to receiver if online
				const receiverSocketId = userSockets.get(receiverId);
				if (receiverSocketId) {
					io.to(receiverSocketId).emit("receive_message", message);
				}

				// confirm to sender
				socket.emit("message_sent", message);
			} catch (error) {
				console.error("❌ Message error:", error.message);
				socket.emit("message_error", "Failed to send message");
			}
		});

		// ❌ DISCONNECT
		socket.on("disconnect", () => {
			let disconnectedUserId = null;

			for (const [userId, socketId] of userSockets.entries()) {
				if (socketId === socket.id) {
					disconnectedUserId = userId;
					userSockets.delete(userId);
					userActivities.delete(userId);
					break;
				}
			}

			if (disconnectedUserId) {
				io.emit("user_disconnected", disconnectedUserId);
				io.emit("users_online", Array.from(userSockets.keys()));
				io.emit("activities", Array.from(userActivities.entries()));
			}

			console.log("❌ Socket disconnected:", socket.id);
		});
	});
};