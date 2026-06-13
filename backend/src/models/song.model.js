import mongoose from "mongoose";

const songSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
		},
		artist: {
			type: String,
			required: true,
			trim: true,
			index: true,
		},
		imageUrl: {
			type: String,
			required: true,
		},
		audioUrl: {
			type: String,
			required: true,
		},
		duration: {
			type: Number,
			required: true,
			min: 0, 
		},
		albumId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Album",
			default: null,
		},

		playCount: {
			type: Number,
			default: 0,
		},
		isFeatured: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);



songSchema.index({ artist: 1, createdAt: -1 });

export const Song = mongoose.model("Song", songSchema);