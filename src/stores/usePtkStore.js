import { create } from "zustand";
import axios from "axios";
import { useUserStore } from "./useUserStore";

export const usePtkStore = create((set) => ({
  ptkData: [],
  isLoading: false,
  error: null,
  totalPages: 0,

  fetchPtk: async (params) => {
    set({ isLoading: true, error: null });
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`http://localhost:3000/api/ptk?page=${params}`, { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } });
      if (!response.status === 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.data;

      set({
        ptkData: data.data,
        isLoading: false,
        totalPages: data.totalPages,
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
}));
