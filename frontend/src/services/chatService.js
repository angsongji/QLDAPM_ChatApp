import axiosClient from "./axiosClient";

const rootAPI = "/chats/";
const getChattedUsers = () => axiosClient.get(rootAPI);
const createNewChat = (dataChat) => axiosClient.post(rootAPI, dataChat);

export { getChattedUsers, createNewChat };
