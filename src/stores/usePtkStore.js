import { create } from "zustand";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

export const usePtkStore = create((set) => ({
  // --- STATE ---
  ptkData: [], // Data PTK yang akan disimpan
  isLoading: false, // Status untuk menunjukkan pemuatan sedang berjalan
  error: null, // Menyimpan pesan error jika gagal

  fetchPtk: async () => {
    // 1. Set status loading menjadi true
    set({ isLoading: true, error: null });
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get("http://localhost:3000/api/ptk", { headers: { Authorization: `Beaerer ${token}`, Accept: "application/json" } });

      if (!response.status === 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.data;

      set({
        ptkData: data.data,
        isLoading: false,
      });
    } catch (error) {
      console.error("Failed to fetch PTK data:", error);
      set({
        isLoading: false,
        error: error.message || "Gagal memuat data PTK.",
        ptkData: [], // Kosongkan data jika ada error
      });
    }
  },
}));
