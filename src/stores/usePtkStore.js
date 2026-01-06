import { create } from "zustand";
import axios from "axios";
import { useUserStore } from "./useUserStore";

const usePtkStore = create((set, get) => ({
  ptkData: [],
  isLoading: false,
  error: null,
  totalPages: 0,
  currentPage: 1,
  currentLimit: 10,

  fetchPtk: async (page, limit) => {
    set({ isLoading: true, error: null, currentPage: page });
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`http://localhost:3000/api/ptk?page=${page}&limit=${limit}`, { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } });
      if (!response.status === 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.data;

      set({
        ptkData: data.data,
        isLoading: false,
        totalPages: data.totalPages,
        currentPage: page,
        currentLimit: limit,
      });
    } catch (error) {
      console.error("Failed to fetch PTK data:", error);
      set({
        isLoading: false,
        error: error.response?.data?.message || error.message || "Gagal memuat data PTK.",
        ptkData: [],
      });
      useUserStore.getState().logout();
    }
  },

  deletePtk: async () => {
    const { ptkData } = get();
    set({ isLoading: true });

    if (!ptkData || ptkData.length === 0) {
      // Berikan pesan error yang jelas agar bisa ditangkap catch di UI
      throw new Error("Data sudah kosong");
    }
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete("http://localhost:3000/api/ptk", { headers: { Authorization: `Bearer ${token}` } });
      if (response.status === 200) {
        set({ ptkData: [], totalPages: 0, currentPage: 1, isLoading: false });
        return true;
      }
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  uploadPtk: async (payload) => {
    const token = localStorage.getItem("token");
    try {
      set({ isLoading: true });
      const response = await axios.post("http://localhost:3000/api/upload/ptk", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ isLoading: false });
      return response.status === 200;
    } catch (error) {
      set({ isLoading: false }); // Hanya matikan jika ERROR
      throw error;
    }
  },

  searchPtk: async (query = "", page = 1, limit = 10) => {
    const token = localStorage.getItem("token");

    try {
      // set({ isLoading: true });
      const response = await axios.get(`http://localhost:3000/api/ptk/search?query=${query}&page=${page}&limit=${limit}`, { headers: { Authorization: `Bearer ${token}` } });

      if (!response.status === 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.data;

      set({
        ptkData: data.data, // Pastikan akses .data jika backend membungkusnya
        totalPages: data.totalPages,
        currentPage: page,
        currentLimit: limit,
        // isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      console.error("Search Error:", error);
    }
  },
}));

export { usePtkStore };
