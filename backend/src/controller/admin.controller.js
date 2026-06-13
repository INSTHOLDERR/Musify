import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
import { User } from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";

const uploadToCloudinary = async (file) => {
	try {
		if (!file?.tempFilePath) throw new Error("File path missing");
		const result = await cloudinary.uploader.upload(file.tempFilePath, { resource_type: "auto" });
		return result.secure_url;
	} catch (error) {
		console.error("Cloudinary Upload Error:", error.message);
		throw new Error("Failed to upload file");
	}
};

export const checkAdmin = async (req, res) => {
	res.status(200).json({ admin: true });
};

export const createSong = async (req, res, next) => {
	try {
		if (!req.files?.audioFile || !req.files?.imageFile)
			return res.status(400).json({ message: "Audio and image files are required" });
		const { title, artist, albumId, duration } = req.body;
		if (!title || !artist || !duration)
			return res.status(400).json({ message: "Title, artist and duration are required" });
		const audioUrl = await uploadToCloudinary(req.files.audioFile);
		const imageUrl = await uploadToCloudinary(req.files.imageFile);
		const song = await Song.create({ title, artist, audioUrl, imageUrl, duration, albumId: albumId || null });
		if (albumId) await Album.findByIdAndUpdate(albumId, { $push: { songs: song._id } });
		res.status(201).json(song);
	} catch (error) {
		console.error("createSong Error:", error.message);
		next(error);
	}
};

export const deleteSong = async (req, res, next) => {
	try {
		const { id } = req.params;
		const song = await Song.findById(id);
		if (!song) return res.status(404).json({ message: "Song not found" });
		if (song.albumId) await Album.findByIdAndUpdate(song.albumId, { $pull: { songs: song._id } });
		await Song.findByIdAndDelete(id);
		res.status(200).json({ message: "Song deleted successfully" });
	} catch (error) {
		next(error);
	}
};

export const createAlbum = async (req, res, next) => {
	try {
		const { title, artist, releaseYear } = req.body;
		if (!req.files?.imageFile) return res.status(400).json({ message: "Album image is required" });
		if (!title || !artist || !releaseYear)
			return res.status(400).json({ message: "Title, artist and release year are required" });
		const imageUrl = await uploadToCloudinary(req.files.imageFile);
		const album = await Album.create({ title, artist, imageUrl, releaseYear });
		res.status(201).json(album);
	} catch (error) {
		next(error);
	}
};

export const deleteAlbum = async (req, res, next) => {
	try {
		const { id } = req.params;
		const album = await Album.findById(id);
		if (!album) return res.status(404).json({ message: "Album not found" });
		await Song.deleteMany({ albumId: id });
		await Album.findByIdAndDelete(id);
		res.status(200).json({ message: "Album deleted successfully" });
	} catch (error) {
		next(error);
	}
};

export const getAllUsersAdmin = async (req, res, next) => {
	try {
		const users = await User.find().sort({ createdAt: -1 }).lean();
		res.status(200).json(users);
	} catch (error) {
		next(error);
	}
};

export const blockUser = async (req, res, next) => {
	try {
		const { id } = req.params;
		const user = await User.findById(id);
		if (!user) return res.status(404).json({ message: "User not found" });
		user.isBlocked = !user.isBlocked;
		await user.save();
		res.status(200).json({ message: user.isBlocked ? "User blocked" : "User unblocked", isBlocked: user.isBlocked });
	} catch (error) {
		next(error);
	}
};
