import express from "express";
import { getUsers, updateProfile } from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/user.middleware.js";
const router = express.Router();

router.put("/", protectRoute, updateProfile);
router.get("/", protectRoute, getUsers);
export default router;
