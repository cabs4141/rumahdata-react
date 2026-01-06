import { create } from "zustand";
import axios from "axios";

export const useUserStore = create((set, get) => ({
  // Pastikan fallback ke string kosong
  token: localStorage.getItem("token") || "",
  userList: [],
  loading: false,
  totalPages: 1,
  currentPage: 1,
  currentLimit: 10,

  getUserLists: async () => {
    set({ loading: true });
    const token = localStorage.getItem("token");
    if (!token || token === "") {
      console.error("Token tidak ditemukan!");
      getState().logout();
      return;
    }
    try {
      const response = await axios.get("http://localhost:3000/api/users", { headers: { Authorization: `Bearer ${token}` } });
      const data = await response.data.data;
      set({
        userList: data,
        loading: false,
      });
    } catch (error) {
      set({
        loading: false,
      });
      get().logout();
      throw error;
    }
  },

  login: async (payload) => {
    try {
      const response = await axios.post("http://localhost:3000/api/auth/login", payload, { headers: { "Content-Type": "application/json" } });
      if (response.status === 200) console.log("berhasil login store", response);
      localStorage.setItem("token", response.data.token);
      set({ token: response.data.token });
      return true;
    } catch (error) {
      throw error;
    }
  },

  register: async (payload) => {
    try {
      const response = await axios.post("http://localhost:3000/api/auth/register", payload);
      if (response.status === 200) {
        console.log("berhasil register dari store");
        return true;
      }
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ token: null });
  },

  refreshUser: () => {
    set({ userInfo: getDecodedToken(), isLoggedIn: !!getDecodedToken() });
  },

  approveUser: async (payload) => {
    try {
      set({ loading: true });
      const token = get().token;
      const response = await axios.post("http://localhost:3000/api/approve-user", payload, { headers: { Authorization: `Bearer:${token}` } });
      if (response.status === 200) console.log("berhasil bosku");
      set({ loading: false });
      return true;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },
}));
