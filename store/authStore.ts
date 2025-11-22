import {create} from "zustand";
import { persist } from "zustand/middleware";            // optional middleware for persistence
import { loginUser, registerUser, UserRecord } from "../service/authService";
import { save, load, remove } from "../utils/storage";   // storage helpers


//single AsyncStorage key USERS_LIST_V1 that contains an array of users.
const CURRENT_USER_KEY = "CURRENT_USER_V1";


type AuthState = {
  user: UserRecord | null;               // currently logged in user
  loading: boolean;                      // loading state for async actions
  login: (username: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  signup: (username: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
  loadUserFromStorage: () => Promise<void>;
};

// Zustand store 
const useAuthStore = create<AuthState>((set, get) => ({
  user: null,           // no user initially
  loading: false,

  // login: 
  login: async (username: string, password: string) => {
    set({ loading: true }); // loading
    try {
      const res = await loginUser({ username, password }); // validate credentials locally
      if (!res.ok) {
        set({ loading: false });
        return { ok: false, error: res.error };
      }
      const user = res.user;
      await save(CURRENT_USER_KEY, user); // persist current user
      set({ user, loading: false });    
      return { ok: true };
    } catch (err: any) {
      console.error("authStore.login err:", err);
      set({ loading: false });
      return { ok: false, error: "Unknown error" };
    }
  },
    // signup:

  signup: async (username: string, password: string) => {
    set({ loading: true });
    try {
      const res = await registerUser({ username, password }); // register new in local storage
      if (!res.ok) {
        set({ loading: false });
        return { ok: false, error: res.error };
      }
      const user = res.user;
      await save(CURRENT_USER_KEY, user); // persist as current user
      set({ user, loading: false });
      return { ok: true };
    } catch (err: any) {
      console.error("authStore.signup err:", err);
      set({ loading: false });
      return { ok: false, error: "Unknown error" };
    }
  },

  // logout: 
  logout: async () => {
    set({ loading: true });
    try {
      await remove(CURRENT_USER_KEY); // remove active user key
      set({ user: null, loading: false });
    } catch (err) {
      console.error("authStore.logout err:", err);
      set({ user: null, loading: false });
    }
  },

  // load user from storage:
  loadUserFromStorage: async () => {
    set({ loading: true });
    try {
      const persisted = await load<UserRecord>(CURRENT_USER_KEY); // try to load active user
      if (persisted) set({ user: persisted });
      set({ loading: false });
    } catch (err) {
      console.error("authStore.loadUserFromStorage err:", err);
      set({ loading: false });
    }
  },
}));

export default useAuthStore;
