import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:5001/api",
  withCredentials: true,
  timeout: 20000, // 20s timeout
});

// axiosClient.interceptors.request.use(
//     config => {
//         const token = localStorage.getItem('token');
//         if (token) {
//             config.headers['Authorization'] = `Bearer ${token}`;
//         }
//         return config;
//     },
//     error => Promise.reject(error)
// );

// axiosClient.interceptors.response.use(
//     response => response,
//     error => {
//         const message = error?.response?.data?.message || 'Lỗi hệ thống!';
//         return Promise.reject({ ...error, message });
//     }
// );

export default axiosClient;
