import express from "express";
import { protectRoute } from "../middleware/user.middleware.js";
import {
  getMessages,
  sendMessage,
  sendMessageToStranger,
} from "../controllers/message.controller.js";

const router = express.Router();
router.get("/:chatId", protectRoute, getMessages);
router.post("/:chatId", protectRoute, sendMessage);
router.post("/", protectRoute, sendMessageToStranger);
export default router;
