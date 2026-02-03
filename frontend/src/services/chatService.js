import axiosClient from "./axiosClient";

const rootAPI = "/chats/";
const getChattedUsers = () => axiosClient.get(rootAPI);
const createNewChat = (dataChat) => axiosClient.post(rootAPI, dataChat);
const updateChat = (chatId, dataChat) => axiosClient.put(`${rootAPI}${chatId}`, dataChat);

export { getChattedUsers, createNewChat, updateChat };
