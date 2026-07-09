import { create } from "zustand";
import { persist } from "zustand/middleware";
import instance from "./axios";

export const useStore = create(
  persist(
    (set, get) => ({
      ui: {
        uploadModalOpen: false,
        sidebarOpen: true,
      },

      auth: {
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      },

      openUploadModal: () =>
        set((state) => ({ ui: { ...state.ui, uploadModalOpen: true } })),
      closeUploadModal: () =>
        set((state) => ({ ui: { ...state.ui, uploadModalOpen: false } })),

      setSidebarOpen: (isOpen) =>
        set((state) => ({ ui: { ...state.ui, sidebarOpen: isOpen } })),

      toggleSidebar: () =>
        set((state) => ({
          ui: { ...state.ui, sidebarOpen: !state.ui.sidebarOpen },
        })),

      setAuth: (user, token) => {
        set({
          auth: {
            user,
            token,
            isAuthenticated: !!user,
            loading: false,
            error: null,
          },
        });
      },

      clearAuth: () => {
        delete instance.defaults.headers.common["Authorization"];
        set({
          auth: {
            user: null,
            token: null,
            isAuthenticated: false,
            loading: false,
            error: null,
          },
        });
      },

      login: async (credentials) => {
        set((state) => ({
          auth: { ...state.auth, loading: true, error: null },
        }));
        try {
          const res = await instance.post("/api/auth/login", credentials);
          const { id, email, username } = res.data;
          const user = { id, email, username };
          set({
            auth: { user, isAuthenticated: true, loading: false, error: null },
          });
          return { user };
        } catch (err) {
          const message = err?.response?.data?.message || err.message;
          set((state) => ({
            auth: { ...state.auth, loading: false, error: message },
          }));
          throw err;
        }
      },

      logout: async () => {
        try {
          await instance.post("/api/auth/logout");
        } catch (e) {}
        // Clear the Vercel domain cookie too
        document.cookie = "token=; path=/; max-age=0; SameSite=Lax";
        get().clearAuth();
      },

      fetchCurrentUser: async () => {
        set((state) => ({
          auth: { ...state.auth, loading: true, error: null },
        }));
        try {
          const res = await instance.get("/api/auth/me");
          const user = res.data;
          set((state) => ({
            auth: {
              ...state.auth,
              user,
              isAuthenticated: true,
              loading: false,
              error: null,
            },
          }));
          return user;
        } catch (err) {
          set((state) => ({
            auth: {
              ...state.auth,
              loading: false,
              error: err?.response?.data?.message || err.message,
            },
          }));
          throw err;
        }
      },

      setAuthToken: (token) => {
        set((state) => ({
          auth: { ...state.auth, token, isAuthenticated: !!token },
        }));
      },

      updateUser: (patch) =>
        set((state) => ({
          auth: { ...state.auth, user: { ...state.auth.user, ...patch } },
        })),
    }),
    {
      name: "pixtura-store",
      partialize: (state) => ({ ui: { sidebarOpen: state.ui.sidebarOpen } }),
    },
  ),
);

export default useStore;
