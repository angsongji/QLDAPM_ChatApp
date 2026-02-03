import axiosClient from "./axiosClient";

const rootAPI = "/users/";
const uploadProfile = (object) => axiosClient.put(rootAPI, object);
const getUsers = () => axiosClient.get(`${rootAPI}`);
export { uploadProfile, getUsers };
