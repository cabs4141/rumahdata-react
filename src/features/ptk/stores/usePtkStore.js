import { create } from "zustand";
import axios from "axios";
import { useUserStore } from "@/features/users/stores/useUserStore";
const apiUrl = import.meta.env.VITE_API_URL;

const usePtkStore = create((set, get) => ({
  ptkData: [],
  isLoading: false,
  isFetching: false,
  error: null,
  totalPages: 0,
  totalData: 0, // Add totalData state
  currentPage: 1,
  currentLimit: 10,
  currentQuery: "",
  filters: { kabupaten: "" }, // Add filter state
  setFilters: (newFilters) => set((state) => ({ filters: { ...state.filters, ...newFilters } })),

  ptkStatistik: [],
  totalPtkStatistik: 0,
  abortController: null, // Store the controller properly

  isStatistikLoading: false,

  getStatistikPtk: async () => {
    const token = localStorage.getItem("token");
    const PAGE_SIZE = 5000;
    set({ isStatistikLoading: true });
    try {
      const firstRes = await axios.get(
        `${apiUrl}/ptk?page=1&limit=${PAGE_SIZE}`,
        { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } }
      );
      const firstData = firstRes.data;
      const totalData = firstData.totalData || firstData.data?.length || 0;
      const totalPages = firstData.totalPages || 1;
      let allData = [...(firstData.data || [])];

      if (totalPages > 1) {
        const pageNumbers = Array.from({ length: totalPages - 1 }, (_, i) => i + 2);
        const responses = await Promise.all(
          pageNumbers.map((page) =>
            axios.get(`${apiUrl}/ptk?page=${page}&limit=${PAGE_SIZE}`, {
              headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
            })
          )
        );
        responses.forEach((res) => {
          allData = allData.concat(res.data?.data || []);
        });
      }

      set({
        ptkStatistik: allData,
        totalPtkStatistik: totalData,
        isStatistikLoading: false,
      });
    } catch (error) {
      console.error("Failed to fetch statistik PTK:", error);
      set({
        ptkStatistik: [],
        totalPtkStatistik: 0,
        isStatistikLoading: false
      });
    }
  },

  getPtk: async ({ page = 1, limit = 10, query = "" } = {}) => {
    // Cancel previous request if it exists
    const { abortController, filters } = get();
    if (abortController) {
      abortController.abort();
    }

    const newController = new AbortController();
    set({
      isFetching: true,
      error: null,
      currentPage: page,
      currentLimit: limit, // Ensure limit is updated in state
      currentQuery: query, // Ensure query is updated in state
      abortController: newController,
    });

    const token = localStorage.getItem("token");

    // CLIENT-SIDE FILTERING (Fallback)
    if (filters.kabupaten) {
      set({
        isFetching: true,
        error: null,
        currentPage: page,
        currentLimit: limit,
        currentQuery: query,
        abortController: null // No real abort for local op
      });

      const { ptkStatistik } = get();
      if (!ptkStatistik || ptkStatistik.length === 0) {
        set({
          ptkData: [],
          totalPages: 0,
          totalData: 0,
          isFetching: false,
        });
        return;
      }

      let filtered = ptkStatistik.filter((p) => p.kabupaten === filters.kabupaten);

      if (query) {
        const lowerQ = query.toLowerCase();
        filtered = filtered.filter(p =>
          (p.nama && p.nama.toLowerCase().includes(lowerQ)) ||
          (p.nip && p.nip.toLowerCase().includes(lowerQ)) ||
          (p.nik && p.nik.toLowerCase().includes(lowerQ))
        );
      }

      const totalData = filtered.length;
      const totalPages = Math.ceil(totalData / limit);
      const startIndex = (page - 1) * limit;
      const paginatedData = filtered.slice(startIndex, startIndex + limit);

      set({
        ptkData: paginatedData,
        totalPages: totalPages,
        totalData: totalData,
        isFetching: false,
      });
      return;
    }


    let url = query
      ? `${apiUrl}/ptk/search?query=${query}&page=${page}&limit=${limit}`
      : `${apiUrl}/ptk?page=${page}&limit=${limit}`;

    // Note: Removed &kabupaten=... append since backend doesn't support it.

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        signal: newController.signal,
      });

      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = response.data;
      // Handle different response structures if necessary (e.g. search might wrap data in .data)

      set({
        ptkData: query ? data.data : (Array.isArray(data) ? data : (data.data || [])), // Defensive coding
        totalPages: data.totalPages || 0,
        totalData: data.totalData || (Array.isArray(data) ? data.length : (data.data?.length || 0)),
        isFetching: false,
        abortController: null,
      });

    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Request canceled", error.message);
        return; // Do not update state or error
      }
      console.error("Failed to fetch PTK data:", error);
      set({
        isFetching: false,
        error: error.response?.data?.message || error.message || "Gagal memuat data PTK.",
        ptkData: [],
        abortController: null,
      });
      if (error.response?.status === 401) {
        useUserStore.getState().logout();
      }
    }
  },

  deletePtk: async () => {
    const { ptkData, currentQuery, currentPage, currentLimit, getPtk } = get();
    set({ isLoading: true });

    if (!ptkData || ptkData.length === 0) {
      throw new Error("Data sudah kosong");
    }
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`${apiUrl}/ptk`, { headers: { Authorization: `Bearer ${token}` } });
      if (response.status === 200) {
        set({ ptkData: [], totalPages: 0, currentPage: 1, isLoading: false });
        // Refresh data
        await getPtk({ page: currentPage, limit: currentLimit, query: currentQuery });
        return true;
      }
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  uploadPtk: async (payload) => {
    const { currentQuery, currentLimit, getPtk } = get();
    const token = localStorage.getItem("token");
    try {
      set({ isLoading: true });
      const response = await axios.post(`${apiUrl}/upload/ptk`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Refresh data
      await getPtk({ page: 1, limit: currentLimit, query: currentQuery });

      set({ isLoading: false });
      return response.status === 200;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
}));

export { usePtkStore };
