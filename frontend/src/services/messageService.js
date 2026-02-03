import axiosClient from "./axiosClient";

const rootAPI = "/messages/";
const getMessages = (chatId) => axiosClient.get(`${rootAPI}${chatId}`);
const sendMessage = (messageData, chatId) =>
  axiosClient.post(`${rootAPI}${chatId}`, messageData);
const sendMessageToStranger = (messageData) =>
  axiosClient.post(rootAPI, messageData);

export { getMessages, sendMessage, sendMessageToStranger };
