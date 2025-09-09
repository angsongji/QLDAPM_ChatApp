import { create } from "zustand";
import {
  getMessages,
  sendMessage,
  sendMessageToStranger,
} from "../services/messageService";
import toast from "react-hot-toast";
export const useMessageStore = create((set, get) => ({
  messages: [],
  chatsId: [],
  isGetMessagesLoading: false,
  isSendMessageLoading: false,

  setMessages: (messages) => {
    set({ messages: messages });
  },

  getMessages: async (chatId) => {
    const { chatsId } = get();
    const filteredChat = chatsId.filter((item) => item === chatId);

    if (filteredChat.length === 0) {
      set((state) => ({
        isGetMessagesLoading: true,
        chatsId: [...state.chatsId, chatId],
      }));

      try {
        const result = await getMessages(chatId);
        const data = result.data;
        if (data.length != 0) {
          set((state) => ({
            messages: [...state.messages, ...data],
          }));
        }
      } catch (error) {
        // console.error("Failed to fetch messages:", error);
      } finally {
        set({ isGetMessagesLoading: false });
      }
    }
  },

  sendMessage: async (messageData, chatId) => {
    set({ isSendMessageLoading: true });
    try {
      const result = await sendMessage(messageData, chatId);
      set((state) => ({
        messages: [...state.messages, result.data],
      }));
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSendMessageLoading: false });
    }
  },

  sendMessageToStranger: async (messageData) => {
    set({ isSendMessageLoading: true });
    try {
      await sendMessageToStranger(messageData);
    } catch (error) {
      // console.error("error send to stranger ", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isSendMessageLoading: false });
    }
  },

  reset: () =>
    set({
      messages: [],
      chatsId: [],
      isGetMessagesLoading: false,
      isSendMessageLoading: false,
    }),
}));
