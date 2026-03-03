import { create } from "zustand";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

const usePesertaStore = create((set, get) => ({
  allPeserta: [],
  isLoading: false,
  isFetching: false,
  error: null,

  // Fetch ALL peserta (2-step: get count then fetch all)
  fetchAllPeserta: async () => {
    const token = localStorage.getItem("token");
    set({ isFetching: true, error: null });
    try {
      const countRes = await axios.get(`${apiUrl}/peserta?page=1&limit=1`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      const totalData = countRes.data?.totalData || 0;

      if (totalData === 0) {
        set({ allPeserta: [], isFetching: false });
        return;
      }

      const response = await axios.get(`${apiUrl}/peserta?page=1&limit=${totalData}`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      set({ allPeserta: response.data.data || [], isFetching: false });
    } catch (error) {
      console.error("Failed to fetch all peserta:", error);
      set({ isFetching: false, error: error.message, allPeserta: [] });
    }
  },

  // Filter peserta by kegiatan_id (client-side)
  getPesertaByKegiatan: (kegiatanId) => {
    const { allPeserta } = get();
    return allPeserta.filter((p) => String(p.kegiatan_id) === String(kegiatanId));
  },

  // Upload peserta for a specific kegiatan
  uploadPeserta: async (file, kegiatanId) => {
    const token = localStorage.getItem("token");
    set({ isLoading: true });
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("kegiatan_id", kegiatanId);
      await axios.post(`${apiUrl}/upload/peserta`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Refresh all peserta cache
      await get().fetchAllPeserta();
      set({ isLoading: false });
      return true;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  // Delete a single peserta by id
  deletePeserta: async (id) => {
    const token = localStorage.getItem("token");
    set({ isLoading: true });
    try {
      await axios.delete(`${apiUrl}/peserta/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Remove from local cache
      set((state) => ({
        allPeserta: state.allPeserta.filter((p) => p.peserta_id !== id),
        isLoading: false,
      }));
      return true;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  deleteAllPeserta: async (kegiatanId) => {
    const token = localStorage.getItem("token");
    set({ isLoading: true });
    try {
      await axios.delete(`${apiUrl}/peserta/kegiatan/${kegiatanId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await get().fetchAllPeserta();
      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
}));

export { usePesertaStore };
