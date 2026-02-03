import express from "express";
import { protectRoute } from "../middleware/user.middleware.js";
import {
  getChattedUsers,
  createNewChat,
  updateChat,
} from "../controllers/chat.controller.js";

const router = express.Router();
router.get("/", protectRoute, getChattedUsers);
router.post("/", protectRoute, createNewChat);
router.put("/:chatId", protectRoute, updateChat);
export default router;
