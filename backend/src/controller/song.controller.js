import { Song } from "../models/song.model.js";

// reusable aggregation helper — includes all fields needed by the frontend
const getRandomSongs = async (size) => {
	return await Song.aggregate([
		{ $sample: { size } },
		{
			$project: {
				_id: 1,
				title: 1,
				artist: 1,
				imageUrl: 1,
				audioUrl: 1,
				duration: 1,   // ← was missing
				albumId: 1,
				createdAt: 1,
				updatedAt: 1,
			},
		},
	]);
};

// GET ALL SONGS
export const getAllSongs = async (req, res, next) => {
	try {
		const songs = await Song.find().sort({ createdAt: -1 }).lean();
		res.status(200).json(songs);
	} catch (error) {
		console.error("getAllSongs Error:", error.message);
		next(error);
	}
};

// FEATURED SONGS
export const getFeaturedSongs = async (req, res, next) => {
	try {
		const songs = await getRandomSongs(6);
		res.status(200).json(songs);
	} catch (error) {
		console.error("getFeaturedSongs Error:", error.message);
		next(error);
	}
};

// MADE FOR YOU
export const getMadeForYouSongs = async (req, res, next) => {
	try {
		const songs = await getRandomSongs(4);
		res.status(200).json(songs);
	} catch (error) {
		console.error("getMadeForYouSongs Error:", error.message);
		next(error);
	}
};

// TRENDING SONGS
export const getTrendingSongs = async (req, res, next) => {
	try {
		const songs = await getRandomSongs(4);
		res.status(200).json(songs);
	} catch (error) {
		console.error("getTrendingSongs Error:", error.message);
		next(error);
	}
};
