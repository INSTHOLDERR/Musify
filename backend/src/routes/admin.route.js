import { Router } from "express";
import { checkAdmin, createAlbum, createSong, deleteAlbum, deleteSong, getAllUsersAdmin, blockUser } from "../controller/admin.controller.js";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();
router.use(protectRoute, requireAdmin);

router.get("/check", checkAdmin);
router.get("/users", getAllUsersAdmin);
router.patch("/users/:id/block", blockUser);
router.post("/songs", createSong);
router.delete("/songs/:id", deleteSong);
router.post("/albums", createAlbum);
router.delete("/albums/:id", deleteAlbum);

export default router;
