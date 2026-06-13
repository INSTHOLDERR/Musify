import { User } from "../models/user.model.js";

export const authCallback = async (req, res, next) => {
	try {
		const { id, firstName, lastName, imageUrl } = req.body;

		if (!id) {
			return res.status(400).json({ message: "User ID is required" });
		}

		// check if user already exists
		let user = await User.findOne({ clerkId: id });

		if (!user) {
			// create new user
			user = await User.create({
				clerkId: id,
				fullName: `${firstName || ""} ${lastName || ""}`.trim(),
				imageUrl,
			});
		} else {
			// optional: update user details if changed
			user.fullName = `${firstName || ""} ${lastName || ""}`.trim();
			user.imageUrl = imageUrl || user.imageUrl;

			await user.save();
		}

		res.status(200).json({ success: true, user });
	} catch (error) {
		console.error("authCallback Error:", error.message);
		next(error);
	}
};