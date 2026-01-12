import { create } from "zustand";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

export const useUserStore = create((set, get) => ({
  // Pastikan fallback ke string kosong
  token: localStorage.getItem("token") || "",
  userList: [],
  loading: false,
  totalPages: 1,
  currentPage: 1,
  currentLimit: 10,
  selectedUser: null, // Tambahkan ini untuk menampung data user yang diklik

  getUserLists: async () => {
    set({ loading: true });
    const token = localStorage.getItem("token");
    if (!token || token === "") {
      console.error("Token tidak ditemukan!");
      getState().logout();
      return;
    }
    try {
      const response = await axios.get(`${apiUrl}/users`, { headers: { Authorization: `Bearer ${token}` } });
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
      const response = await axios.post(`${apiUrl}/auth/login`, payload, { headers: { "Content-Type": "application/json" } });
      if (response.status === 200) localStorage.setItem("token", response.data.token);
      set({ token: response.data.token });
      return true;
    } catch (error) {
      throw error;
    }
  },

  register: async (payload) => {
    try {
      const response = await axios.post(`${apiUrl}/auth/register`, payload);
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
      // Payload: { id_user, status, role }
      await axios.post(`${apiUrl}/approve-user`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const currentUser = get().selectedUser;
      set({
        loading: false,
        selectedUser: {
          ...currentUser,
          status: payload.status,
          role: payload.role,
        },
      });
      return true;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  getUserDetail: async (id) => {
    try {
      set({ loading: true });
      const token = get().token;
      const response = await axios.get(`${apiUrl}/user/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      console.log(response);
      set({ loading: false, selectedUser: response.data.data });
      return true;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },
  clearSelectedUser: () => set({ selectedUser: null }),
}));
