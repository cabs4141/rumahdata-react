import { create } from "zustand";
import axios from "axios";

export const useUserStore = create((set) => ({
  // Pastikan fallback ke string kosong
  token: localStorage.getItem("token") || "",

  getUserLists: async () => {
    try {
      const response = await axios.get("http://localhost:3000/");
    } catch (error) {}
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
