import { create } from "zustand";
import { io } from "socket.io-client";
import { useAuthStore } from "./useAuthStore";
import { useChatStore } from "./useChatStore";
import { useMessageStore } from "./useMessageStore";
const BACKEND_URL = "http://localhost:5001";
export const useChatRealtimeStore = create((set, get) => ({
  socket: null,
  onlineUsers: [],
  connectSocket: () => {
    const authUser = useAuthStore.getState().authUser;
    if (!authUser || get().socket?.connected) return;
    const socket = io(BACKEND_URL, {
      query: { userId: authUser._id },
    });
    socket.connect();
    set({ socket: socket });
    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },

  subscribeToMessages: () => {
    const socket = useChatRealtimeStore.getState().socket;
    if (socket) {
      socket.on("newMessage", (newMessage) => {
        const { chattedUsers, setChattedUsers, selectedChat } =
          useChatStore.getState();
        const { messages, setMessages } = useMessageStore.getState();
        const updated = chattedUsers.map((chat) =>
          newMessage._doc.chatId != selectedChat?._id &&
          newMessage._doc.chatId === chat._id
            ? { ...chat, newMessage: true }
            : chat
        );
        if (messages.some((mess) => mess.chatId == newMessage._doc.chatId))
          setMessages([...messages, newMessage._doc]);
        setChattedUsers(updated);
      });

      socket.on("newChat", (newChat) => {
        const { chattedUsers, setChattedUsers, selectedChat, setSelectedChat } =
          useChatStore.getState();
        if (selectedChat != null && selectedChat?._id == undefined)
          setSelectedChat(newChat);
        setChattedUsers([...chattedUsers, newChat]);
      });
    }
  },

  unSubscribeToMessages: () => {
    const socket = useChatRealtimeStore.getState().socket;
    if (socket) socket.off("newMessage");
  },

  reset: () => set({ onlineUsers: [] }),
}));
