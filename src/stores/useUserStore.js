import { create } from "zustand";
import axios from "axios";

export const useUserStore = create((set, get) => ({
  // Pastikan fallback ke string kosong
  token: localStorage.getItem("token") || "",
  userList: [],
  loading: false,

  getUserLists: async () => {
    set({ loading: true });
    const token = get().token;
    if (!token) {
      console.error("Token tidak ditemukan!");
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
      console.log("error dari user lists store:", error);
      set({
        loadin: false,
      });
    }
  },

  login: async (payload) => {
    try {
      const response = await axios.post("http://localhost:3000/api/auth/login", payload, { headers: { "Content-Type": "application/json" } });
      if (response.status === 200) console.log("berhasil login store", response);
      localStorage.setItem("token", response.data.token);
      set({ token: response.data.token });
    } catch (error) {
      console.log(error);
      alert(error.response.data.message);
    }
  },

  register: async (payload) => {
    try {
      const response = await axios.post("http://localhost:3000/api/auth/register", payload);
      if (response.status === 200) {
        console.log("berhasil register dari store");
        alert("register berhasil");
        return true;
      }
    } catch (error) {
      console.log(error);
      alert(error.response.data.error);
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ token: null });
  },

  refreshUser: () => {
    set({ userInfo: getDecodedToken(), isLoggedIn: !!getDecodedToken() });
  },
}));
