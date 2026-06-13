import mongoose from "mongoose";

const albumSchema = new mongoose.Schema(
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
		releaseYear: {
			type: Number,
			required: true,
			min: 1900,
			max: new Date().getFullYear(),
		},
		songs: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Song",
			},
		],
	},
	{
		timestamps: true,
	}
);



albumSchema.virtual("songCount").get(function () {
	return this.songs.length;
});


albumSchema.set("toJSON", { virtuals: true });
albumSchema.set("toObject", { virtuals: true });

export const Album = mongoose.model("Album", albumSchema);