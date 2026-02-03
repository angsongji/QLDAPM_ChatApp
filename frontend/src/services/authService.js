import axiosClient from "./axiosClient";
const rootAPI = "/auth/";
const check = () => axiosClient.get(rootAPI);
const signUp = (formData) => axiosClient.post(`${rootAPI}signup`, formData);
const logIn = (formData) => axiosClient.post(`${rootAPI}login`, formData);
const logOut = () => axiosClient.post(`${rootAPI}logout`);

export { check, signUp, logIn, logOut };
