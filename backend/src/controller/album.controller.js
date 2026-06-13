import { Album } from "../models/album.model.js";

// 📀 GET ALL ALBUMS
export const getAllAlbums = async (req, res, next) => {
	try {
		const albums = await Album.find().sort({ createdAt: -1 });

		res.status(200).json(albums);
	} catch (error) {
		console.error("getAllAlbums Error:", error.message);
		next(error);
	}
};


// 📀 GET ALBUM BY ID
export const getAlbumById = async (req, res, next) => {
	try {
		const { albumId } = req.params;

		if (!albumId) {
			return res.status(400).json({ message: "Album ID is required" });
		}

		const album = await Album.findById(albumId).populate({
			path: "songs",
			options: { sort: { createdAt: -1 } },
		});

		if (!album) {
			return res.status(404).json({ message: "Album not found" });
		}

		res.status(200).json(album);
	} catch (error) {
		console.error("getAlbumById Error:", error.message);
		next(error);
	}
};