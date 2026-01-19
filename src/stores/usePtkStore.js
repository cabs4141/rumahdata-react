import { create } from "zustand";
import axios from "axios";
import { useUserStore } from "./useUserStore";
const apiUrl = import.meta.env.VITE_API_URL;

const usePtkStore = create((set, get) => ({
  ptkData: [],
  isLoading: false,
  isFetching: false,
  error: null,
  totalPages: 0,
  currentPage: 1,
  currentLimit: 10,
  currentQuery: "",

  fetchPtk: async (page, limit) => {
    set({ isFetching: true, error: null, currentPage: page, currentQuery: "" });
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${apiUrl}/ptk?page=${page}&limit=${limit}`, { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } });
      if (!response.status === 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.data;

      set({
        ptkData: data,
        isFetching: false,
        totalPages: data.totalPages,
        currentPage: page,
        currentLimit: limit,
      });
    } catch (error) {
      console.error("Failed to fetch PTK data:", error);
      set({
        isFetching: false,
        error: error.response?.data?.message || error.message || "Gagal memuat data PTK.",
        ptkData: [],
      });
      useUserStore.getState().logout();
    }
  },

  deletePtk: async () => {
    const { ptkData, currentQuery, currentPage, currentLimit, searchPtk, fetchPtk } = get();
    set({ isLoading: true });

    if (!ptkData || ptkData.length === 0) {
      // Berikan pesan error yang jelas agar bisa ditangkap catch di UI
      throw new Error("Data sudah kosong");
    }
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`${apiUrl}/ptk`, { headers: { Authorization: `Bearer ${token}` } });
      if (response.status === 200) {
        set({ ptkData: [], totalPages: 0, currentPage: 1, isLoading: false });
        if (currentQuery) {
          await searchPtk(currentQuery, currentPage, currentLimit);
        } else {
          await fetchPtk(currentPage, currentLimit);
        }
        return true;
      }
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  uploadPtk: async (payload) => {
    const { currentQuery, currentLimit, searchPtk, fetchPtk } = get();
    const token = localStorage.getItem("token");
    try {
      set({ isLoading: true });
      const response = await axios.post(`${apiUrl}/upload/ptk`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (currentQuery) {
        await searchPtk(currentQuery, 1, currentLimit);
      } else {
        await fetchPtk(1, currentLimit);
      }
      set({ isLoading: false });
      return response.status === 200;
    } catch (error) {
      set({ isLoading: false }); // Hanya matikan jika ERROR
      throw error;
    }
  },

  searchPtk: async (query, page = 1, limit = 10) => {
    const token = localStorage.getItem("token");

    const effectiveQuery = query !== undefined ? query : get().currentQuery;
    try {
      set({ isFetching: true, currentQuery: effectiveQuery });
      const response = await axios.get(`${apiUrl}/ptk/search?query=${effectiveQuery}&page=${page}&limit=${limit}`, { headers: { Authorization: `Bearer ${token}` } });
      if (!response.status === 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.data;

      set({
        ptkData: data.data, // Pastikan akses .data jika backend membungkusnya
        totalPages: data.totalPages,
        currentPage: page,
        currentLimit: limit,
        isFetching: false,
      });
    } catch (error) {
      set({ isFetching: false });
      console.error("Search Error:", error);
    }
  },
}));

export { usePtkStore };
