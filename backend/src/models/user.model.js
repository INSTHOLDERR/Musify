import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		fullName: { type: String, required: true, trim: true },
		imageUrl: { type: String, required: true },
		clerkId: { type: String, required: true, unique: true, index: true },
		email: { type: String, lowercase: true, trim: true },
		role: { type: String, enum: ["user", "admin"], default: "user" },
		isBlocked: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

userSchema.virtual("initials").get(function () {
	return this.fullName.split(" ").map((name) => name[0]).join("").toUpperCase();
});

userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });

export const User = mongoose.model("User", userSchema);
