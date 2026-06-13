import { Album } from "../models/album.model.js";
import { Song } from "../models/song.model.js";
import { User } from "../models/user.model.js";

export const getStats = async (req, res, next) => {
	try {
		const [totalSongs, totalAlbums, totalUsers, songArtists, albumArtists] =
			await Promise.all([
				Song.countDocuments(),
				Album.countDocuments(),
				User.countDocuments(),

				// 🎵 unique artists from songs
				Song.distinct("artist"),

				// 📀 unique artists from albums
				Album.distinct("artist"),
			]);

		// 🔥 merge and get unique count
		const uniqueArtistsSet = new Set([...songArtists, ...albumArtists]);

		res.status(200).json({
			totalSongs,
			totalAlbums,
			totalUsers,
			totalArtists: uniqueArtistsSet.size,
		});
	} catch (error) {
		console.error("getStats Error:", error.message);
		next(error);
	}
};