// src/stores/usePtkStore.js
import { create } from "zustand";

export const usePtkStore = create((set) => ({
  // --- STATE ---
  ptkData: [], // Data PTK yang akan disimpan
  isLoading: false, // Status untuk menunjukkan pemuatan sedang berjalan
  error: null, // Menyimpan pesan error jika gagal

  // --- ACTIONS ---

  // Action asinkron untuk mengambil data dari API
  fetchPtk: async () => {
    // 1. Set status loading menjadi true
    set({ isLoading: true, error: null });

    try {
      const response = await fetch("http://localhost:3000/api/ptk");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // 2. Jika berhasil: update state data dan set loading ke false
      set({
        ptkData: data,
        isLoading: false,
      });
    } catch (error) {
      // 3. Jika gagal: simpan error dan set loading ke false
      console.error("Failed to fetch PTK data:", error);
      set({
        isLoading: false,
        error: error.message || "Gagal memuat data PTK.",
        ptkData: [], // Kosongkan data jika ada error
      });
    }
  },
}));
