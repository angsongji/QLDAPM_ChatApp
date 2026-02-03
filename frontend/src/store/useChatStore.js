import { create } from "zustand";
import { getChattedUsers, createNewChat } from "../services/chatService";
import { useMessageStore } from "./useMessageStore";
export const useChatStore = create((set, get) => ({
  selectedChat: null,
  isCheckedShowOnline: false,
  chattedUsers: [],
  isChattedUsersLoading: false,
  isCreateNewChatLoading: false,

  setIsCheckedShowOnline: (state) => {
    set({ isCheckedShowOnline: state });
  },

  setSelectedChat: (chat) => {
    set({ selectedChat: chat });
    const chattedUsers = get().chattedUsers;
    const updateChattedUser = chattedUsers?.find(
      (chattedUser) =>
        chat?._id == chattedUser._id &&
        chattedUser.newMessage !== undefined &&
        chattedUser.newMessage
    );
    if (updateChattedUser)
      get().setChattedUsers(
        chattedUsers?.map((chattedUser) =>
          chattedUser._id === updateChattedUser._id
            ? { ...updateChattedUser, newMessage: false }
            : chattedUser
        )
      );
    if (chat == null) useMessageStore.getState().setMessages([]);
    else if (chat != null && chat._id != undefined)
      useMessageStore.getState().getMessages(chat._id);
  },

  setChattedUsers: (newData) => {
    set({ chattedUsers: newData });
  },

  getChattedUsers: async () => {
    set({ isChattedUsersLoading: true });
    try {
      const result = await getChattedUsers();
      set({ chattedUsers: result.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isChattedUsersLoading: false });
    }
  },

  createNewChat: async (dataChat) => {
    set({ isCreateNewChatLoading: true });
    try {
      const result = await createNewChat(dataChat);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error create new chat");
    } finally {
      set({ isCreateNewChatLoading: false });
    }
  },

  reset: () =>
    set({
      selectedChat: null,
      isCheckedShowOnline: false,
      chattedUsers: [],
      isChattedUsersLoading: false,
      isCreateNewChatLoading: false,
    }),
}));
