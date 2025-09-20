import axios from "axios";
import type { HttpError } from "@refinedev/core";

export const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const customError: HttpError = {
      ...error,
      message: error.response?.data?.message,
      statusCode: error.response?.status,
    };

    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401) {
      // Clear any stored authentication data
      localStorage.removeItem('token');
      localStorage.removeItem('auth');
      
      // Redirect to login page
      window.location.href = '/login';
    }

    return Promise.reject(customError);
  },
);
