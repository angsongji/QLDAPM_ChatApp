import Chat from "../models/chat.model.js";
import { getUserSocketId, io } from "../lib/socket.js";

export const getChatByChatId = async (chatId) => {
  try {
    const chat = await Chat.findById(chatId);
    return chat;
  } catch (error) {
    console.error(error);
    return { message: "Internal Server Error" };
  }
};

export const getChattedUsers = async (req, res) => {
  try {
    const loggedUserId = req.user._id;

    const chats = await Chat.find({ users: loggedUserId })
      .populate({
        path: "users",
        select: "_id fullName profilePic",
      })
      .lean();

    const filterdChats = chats.map((chat) => ({
      ...chat,
      users: chat.users.filter(
        (user) => user._id.toString() != loggedUserId.toString()
      ),
    }));
    res.status(200).json(filterdChats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createChat = async ({ currentUserId, users, name }) => {
  const newChat = new Chat({ users: [...users, currentUserId], name });
  await newChat.save();
  const chatWithInforUsers = await Chat.findById(newChat._id)
    .populate({
      path: "users",
      select: "_id fullName profilePic",
    })
    .lean();
  return chatWithInforUsers;
};

export const createNewChat = async (req, res) => {
  try {
    const { users, name } = req.body;
    const newChat = await createChat({
      currentUserId: req.user._id,
      users,
      name,
    });

    //Send chat realtime
    newChat.users.forEach((user) => {
      const socketId = getUserSocketId(user._id);
      const filterUsers = newChat.users.filter(
        (u) => u._id.toString() != user._id.toString()
      );
      io.to(socketId).emit("newChat", { ...newChat, users: filterUsers });
    });
    res.status(200).json(newChat);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { users, name } = req.body;
    const loggedUserId = req.user._id;

    // Kiểm tra chat tồn tại
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Kiểm tra user có quyền update (phải là thành viên nhóm)
    const isUserInChat = chat.users.some(
      (userId) => userId.toString() === loggedUserId.toString()
    );
    if (!isUserInChat) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Update chat
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { name, users: [...users, loggedUserId] },
      { new: true }
    )
      .populate({
        path: "users",
        select: "_id fullName profilePic",
      })
      .lean();

    // Emit realtime update đến tất cả members
    updatedChat.users.forEach((user) => {
      const socketId = getUserSocketId(user._id);
      const filterUsers = updatedChat.users.filter(
        (u) => u._id.toString() != user._id.toString()
      );
      io.to(socketId).emit("chatUpdated", { ...updatedChat, users: filterUsers });
    });

    res.status(200).json(updatedChat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
