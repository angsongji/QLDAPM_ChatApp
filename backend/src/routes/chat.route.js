import express from "express";
import { protectRoute } from "../middleware/user.middleware.js";
import {
  getChattedUsers,
  createNewChat,
} from "../controllers/chat.controller.js";

const router = express.Router();
router.get("/", protectRoute, getChattedUsers);
router.post("/", protectRoute, createNewChat);
export default router;
