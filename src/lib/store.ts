import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { User, mockUsers } from "./mock-data/auth";

interface SidebarState {
  isCollapsed: boolean;
  toggle: () => void;
  setCollapsed: (collapsed: boolean) => void;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      isCollapsed: false,
      toggle: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
      setCollapsed: (collapsed) => set({ isCollapsed: collapsed }),
    }),
    {
      name: "sidebar-storage",
    }
  )
);

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loginAs: (role: "ADMIN" | "MANAGER" | "SALE") => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      loginAs: (role) => {
        const user = mockUsers.find((u) => u.role === role);
        if (user) {
          set({ user, isAuthenticated: true });
        }
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
