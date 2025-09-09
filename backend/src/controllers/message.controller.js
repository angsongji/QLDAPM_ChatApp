import cloudinary from "../lib/cloudinary.js";
import { getUserSocketId, io } from "../lib/socket.js";
import Message from "../models/message.model.js";
import { createChat, getChatByChatId } from "./chat.controller.js";

export const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const messages = await Message.find({ chatId }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { chatId } = req.params;
    const senderId = req.user._id;
    let imageUrl = "";
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      chatId,
      senderId,
      text,
      image: imageUrl,
    });

    if (!newMessage) res.status(400).json({ message: "Invalid data" });
    await newMessage.save();

    //send message realtime
    const chat = await getChatByChatId(chatId);
    chat.users
      .filter((userId) => userId.toString() != senderId.toString())
      .forEach((element) => {
        const socketId = getUserSocketId(element);
        if (socketId) {
          io.to(socketId).emit("newMessage", { ...newMessage });
        }
      });

    res.status(200).json(newMessage);
  } catch (error) {
    console.error("Error send message ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const sendMessageToStranger = async (req, res) => {
  try {
    const { users, name } = req.body;
    const newChat = await createChat({
      currentUserId: req.user._id,
      users,
      name,
    });
    req.params.chatId = newChat._id;

    //Send chat realtime
    newChat.users.forEach((user) => {
      const socketId = getUserSocketId(user._id);
      const filterUsers = newChat.users.filter(
        (u) => u._id.toString() != user._id.toString()
      );
      io.to(socketId).emit("newChat", { ...newChat, users: filterUsers });
    });

    await sendMessage(req, res);
  } catch (error) {
    console.error("Error sendMessageToStranger", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
