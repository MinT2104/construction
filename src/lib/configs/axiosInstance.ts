import axios from "axios";
import Cookies from "js-cookie";
// import { authService } from "../services/auth.service"; // authService is no longer used for refreshToken
import { useAuthStore } from "@/lib/store/useAuthStore";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Accept-Language": "vi",
  },
  timeout: 20000,
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    console.log("request to ", config.url);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("response from ", response.config.url);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    console.log("error from ", originalRequest.url);
    console.log("error", error);

    // Check if error is due to expired token (401 Unauthorized)
    if (error.response && error.response.status === 401) {
      // Check if the route is an admin route
      // Remove the expired token
      Cookies.remove("token");

      // Redirect to admin login page if in browser environment
      if (typeof window !== "undefined") {
        window.location.href = "/admin";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
