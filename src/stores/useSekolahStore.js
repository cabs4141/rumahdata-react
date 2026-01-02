import { create } from "zustand";
import axios from "axios";
import { useUserStore } from "./useUserStore";

export const useSekolahStore = create((set) => ({
  sekolahData: [], // Data PTK yang akan disimpan
  isLoading: false, // Status untuk menunjukkan pemuatan sedang berjalan
  error: null, // Menyimpan pesan error jika gagal
  totalPages: 0,

  fetchSekolah: async (params) => {
    set({ isLoading: true, error: null });
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`http://localhost:3000/api/sekolah?page=${params}`, { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } });

      if (!response.status === 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.data;

      set({
        sekolahData: data.data,
        isLoading: false,
        totalPages: data.totalPages,
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
}));
