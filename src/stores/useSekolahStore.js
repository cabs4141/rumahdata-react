import { create } from "zustand";
import axios from "axios";
import { useUserStore } from "./useUserStore";

const useSekolahStore = create((set, get) => ({
  sekolahData: [], // Data PTK yang akan disimpan
  isLoading: false, // Status untuk menunjukkan pemuatan sedang berjalan
  error: null, // Menyimpan pesan error jika gagal
  totalPages: 0,
  currentPage: 1,
  currentLimit: 10,

  fetchSekolah: async (page, limit) => {
    set({ isLoading: true, error: null, currentPage: page });
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`http://localhost:3000/api/sekolah?page=${page}&limit=${limit}`, { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } });

      if (!response.status === 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.data;

      set({
        sekolahData: data.data,
        isLoading: false,
        totalPages: data.totalPages,
        currentPage: page,
        currentLimit: limit,
      });
    } catch (error) {
      console.error("Failed to fetch sekolah data dari store:", error);
      set({
        isLoading: false,
        error: error.message || "Gagal memuat data Sekolah.",
        sekolahData: [], // Kosongkan data jika ada error
      });
      useUserStore.getState().logout();
    }
  },

  deleteSekolah: async () => {
    const token = localStorage.getItem("token");
    const { sekolahData } = get();
    set({ isLoading: true });

    if (!sekolahData || sekolahData.length === 0) {
      throw new Error("Data sudah kosong");
    }

    try {
      const response = await axios.delete("http://localhost:3000/api/sekolah", { headers: { Authorization: `Bearer ${token}` } });
      if (response.status === 200) {
        set({ isLoading: false, sekolahData: [], currentPage: 1, totalPages: 0 });
      }
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  uploadSekolah: async (payload) => {
    const token = localStorage.getItem("token");
    set({ isLoading: true });
    try {
      const response = await axios.post("http://localhost:3000/api/upload/sekolah", payload, { headers: { Authorization: `Bearer ${token}` } });
      if (response.status === 200) set({ isLoading: false });
      return true;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  searchSekolah: async (query = "", page = 1, limit = 10) => {
    const token = localStorage.getItem("token");
    // set({ isLoading: true });

    try {
      const response = await axios.get(`http://localhost:3000/api/sekolah/search?query=${query}&page=${page}&limit=${limit}`, { headers: { Authorization: `Bearer ${token}` } });

      if (response.status === 200) {
        set({
          sekolahData: response.data.data, // Pastikan akses .data jika backend membungkusnya
          totalPages: response.data.totalPages,
          totalData: response.data.totalData,
          currentPage: page,
          currentLimit: limit,
          // isLoading: false,
        });
      }
    } catch (error) {
      // set({ isLoading: false });
      console.error("Search Error:", error);
    }
  },
}));

export { useSekolahStore };
