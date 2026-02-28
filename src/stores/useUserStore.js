import { create } from "zustand";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

export const useUserStore = create((set, get) => ({
  token: localStorage.getItem("token") || "",
  permissions: JSON.parse(localStorage.getItem("permissions")) || [],
  userList: [],
  loading: false,
  totalPages: 1,
  currentPage: 1,
  currentLimit: 10,
  selectedUser: null,
  isFetching: false,

  getUserLists: async () => {
    set({ isFetching: true });
    const token = localStorage.getItem("token");
    if (!token || token === "") {
      console.error("Token tidak ditemukan!");
      getState().logout();
      return;
    }
    try {
      const response = await axios.get(`${apiUrl}/users`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await response.data.data;
      console.log(data);
      set({
        userList: data,
        isFetching: false,
      });
    } catch (error) {
      set({
        isFetching: false,
      });
      get().logout();
      throw error;
    }
  },

  login: async (payload) => {
    try {
      const response = await axios.post(`${apiUrl}/auth/login`, payload, { headers: { "Content-Type": "application/json" } });
      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("permissions", JSON.stringify(response.data.permissions || []));
      }
      set({
        token: response.data.token,
        permissions: response.data.permissions || []
      });
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

  createUser: async (payload) => {
    try {
      set({ loading: true });
      const token = get().token;
      const response = await axios.post(`${apiUrl}/auth/create-user`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ loading: false });
      return true;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("permissions");
    set({ token: null, permissions: [] });
  },

  refreshUser: () => {
    set({ userInfo: getDecodedToken(), isLoggedIn: !!getDecodedToken() });
  },

  editUser: async (id, payload) => {
    try {
      set({ loading: true });
      const token = get().token;
      // Payload: { role, permissions }
      await axios.post(`${apiUrl}/user/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await get().getUserDetail(id);
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

  deleteUser: async (idUser) => {
    try {
      set({ loading: true });
      const token = get().token;
      const response = await axios.delete(`${apiUrl}/user/${idUser}`, { headers: { Authorization: `Bearer ${token}` } });
      if (response.status === 200) {
        set({ loading: false, selectedUser: null });
        return true;
      }
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },
}));
