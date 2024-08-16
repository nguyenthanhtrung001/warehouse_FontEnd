// utils/axiosInstance.ts
import axios from 'axios';
import Cookies from 'js-cookie';

// Tạo instance axios mà không có baseURL
const axiosInstance = axios.create();

// Thêm interceptor để thêm token vào header của tất cả các yêu cầu
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
