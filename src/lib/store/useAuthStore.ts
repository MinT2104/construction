import { authService } from "@/lib/services/auth.service";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";
import { IUser } from "@/lib/types/modules/user.interface";

interface AuthState {
  user: IUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean }>;
  logout: () => Promise<void>;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      loading: false,
      isAuthenticated: false,

      setLoading: (loading: boolean) => set({ loading }),

      login: async (username: string, password: string) => {
        try {
          set({ loading: true });
          const response = await authService.login(username, password);
          if (response.success) {
            // Set the token in the cookie
            Cookies.set("token", response.data.token, {
              expires: 7,
              secure: process.env.NODE_ENV === "production",
            });
            set({
              isAuthenticated: true,
            });
            return response;
          }
        } catch (error: any) {
          console.error("Login failed:", error);
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      logout: async () => {
        try {
          set({ loading: true });
          // Xóa cookie với các tùy chọn giống khi đặt cookie
          Cookies.remove("token", {
            path: "/",
            secure: process.env.NODE_ENV === "production",
            expires: 0,
          });

          await authService.logout();

          // Đảm bảo xóa dữ liệu trong store
          set({
            user: null,
            isAuthenticated: false,
          });
        } catch (error) {
          console.error("Logout failed:", error);
          throw error;
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: "auth-storage", // tên của storage key
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
