import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "@/lib/api";

interface User {
  id: string;
  name: string;
  noHp: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  fetchProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: true,
      login: (token, user) => {
        localStorage.setItem("token", token);
        set({ token, user, isLoading: false });
      },
      logout: () => {
        localStorage.removeItem("token");
        set({ token: null, user: null, isLoading: false });
      },
      fetchProfile: async () => {
        set({ isLoading: true });
        try {
          const response = await api.get("/auth/me");
          set({ user: response.data.data, isLoading: false });
        } catch (error) {
          localStorage.removeItem("token");
          set({ user: null, token: null, isLoading: false });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ token: state.token, user: state.user }),
    },
  ),
);
