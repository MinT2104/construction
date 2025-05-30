import { cookies } from "next/headers";
import axiosInstance from "../configs/axiosInstance";
import authEndpoint from "../endpoints/auth.endpoint";

interface LoginCredentials {
  username: string;
  password: string;
}

class AuthService {
  private static instance: AuthService;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  login = async (username: string, password: string) => {
    try {
      const response = await axiosInstance.post(authEndpoint.login, {
        username,
        password,
      });
      console.log("response", response);
      return response.data;
    } catch (error: any) {
      console.error("Error logging in:", error);
      throw error.response.data;
    }
  };

  async logout(): Promise<void> {
    try {
      // Remove the auth cookie
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  isAuthenticated(): boolean {
    try {
      return document.cookie.includes("admin_token=");
    } catch {
      return false;
    }
  }
}

export const authService = AuthService.getInstance();
