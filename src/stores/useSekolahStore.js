import { create } from "zustand";
import axios from "axios";
import { useUserStore } from "./useUserStore";
const apiUrl = import.meta.env.VITE_API_URL;

const useSekolahStore = create((set, get) => ({
  sekolahData: [], // Data PTK yang akan disimpan
  isLoading: false, // Status untuk menunjukkan pemuatan sedang berjalan
  isFetching: false, // Untuk Fetch/Search (Skeleton)
  error: null, // Menyimpan pesan error jika gagal
  totalPages: 0,
  currentPage: 1,
  currentLimit: 10,
  sekolahDetail: [],

  fetchSekolah: async (page, limit) => {
    set({ isFetching: true, error: null, currentPage: page });
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${apiUrl}/sekolah?page=${page}&limit=${limit}`, { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } });

      if (!response.status === 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.data;

      set({
        sekolahData: data.data,
        isFetching: false, // Matikan Skeleton        totalPages: data.totalPages,
        currentPage: page,
        currentLimit: limit,
      });
    } catch (error) {
      console.error("Failed to fetch sekolah data dari store:", error);
      set({
        isFetching: false,
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
      const response = await axios.delete(`${apiUrl}/sekolah`, { headers: { Authorization: `Bearer ${token}` } });
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
      const response = await axios.post(`${apiUrl}/upload/sekolah`, payload, { headers: { Authorization: `Bearer ${token}` } });
      if (response.status === 200) set({ isLoading: false });
      return true;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  searchSekolah: async (query = "", page = 1, limit = 10) => {
    const token = localStorage.getItem("token");
    set({ isFetching: true });
    try {
      const response = await axios.get(`${apiUrl}/sekolah/search?query=${query}&page=${page}&limit=${limit}`, { headers: { Authorization: `Bearer ${token}` } });

      if (response.status === 200) {
        set({
          sekolahData: response.data.data, // Pastikan akses .data jika backend membungkusnya
          totalPages: response.data.totalPages,
          totalData: response.data.totalData,
          currentPage: page,
          currentLimit: limit,
          isFetching: false,
        });
      }
    } catch (error) {
      set({ isFetching: false });
      console.error("Search Error:", error);
      throw error;
    }
  },

  getSekolahDetail: async (id, page = 1, limit = 10) => {
    try {
      set({ isLoading: true });
      const token = localStorage.getItem("token");
      const response = await axios.get(`${apiUrl}/sekolah/${id}/ptk?page=${page}&limit=${limit}`, { headers: { Authorization: `Bearer ${token}` } });
      set({ isLoading: false, sekolahDetail: response.data });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
}));

export { useSekolahStore };
