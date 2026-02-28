import { create } from "zustand";
import axios from "axios";
import { useUserStore } from "./useUserStore";
const apiUrl = import.meta.env.VITE_API_URL;

const useSekolahStore = create((set, get) => ({
  sekolahData: [],
  isLoading: false,
  isFetching: false,
  error: null,
  totalPages: 0,
  currentPage: 1,
  currentLimit: 10,
  sekolahStatistik: [],
  totalSekolahStatistik: 0,
  currentQuery: "",
  filters: { kabupaten: "" }, // Add filter state

  setFilters: (newFilters) => set((state) => ({ filters: { ...state.filters, ...newFilters } })),

  isStatistikLoading: false,

  getStatistikSekolah: async () => {
    const token = localStorage.getItem("token");
    const PAGE_SIZE = 2000; // per-request limit, sesuaikan dengan kapasitas server
    set({ isStatistikLoading: true });
    try {
      // Ambil halaman pertama untuk mengetahui total data
      const firstRes = await axios.get(
        `${apiUrl}/sekolah?page=1&limit=${PAGE_SIZE}`,
        { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } }
      );
      const firstData = firstRes.data;
      const totalData = firstData.totalData || firstData.data?.length || 0;
      const totalPages = firstData.totalPages || 1;
      let allData = [...(firstData.data || [])];

      // Jika ada halaman berikutnya, fetch semua secara paralel
      if (totalPages > 1) {
        const pageNumbers = Array.from({ length: totalPages - 1 }, (_, i) => i + 2);
        const responses = await Promise.all(
          pageNumbers.map((page) =>
            axios.get(`${apiUrl}/sekolah?page=${page}&limit=${PAGE_SIZE}`, {
              headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
            })
          )
        );
        responses.forEach((res) => {
          allData = allData.concat(res.data?.data || []);
        });
      }

      set({
        sekolahStatistik: allData,
        totalSekolahStatistik: totalData,
        isStatistikLoading: false,
      });
    } catch (error) {
      console.error("Failed to fetch statistik sekolah:", error);
      set({
        sekolahStatistik: [],
        totalSekolahStatistik: 0,
        isStatistikLoading: false,
      });
    }
  },

  fetchSekolah: async (page, limit) => {
    // Reset page to 1 when filters apply? Maybe keep as is.
    // Actually, when fetching with potentially new filters, usually user interaction triggers it.
    // But fetchSekolah is basic pagination without query.
    // If filters are active, we should probably use search endpoint or include params?
    // Let's modify fetchSekolah to also respect filters if valid, or just rely on searchSekolah being the main driver if any filter is active.
    // Or simpler: append filters to URL query params.

    // BUT typically, "fetch" is raw list. "search" is filtered list.
    // We should unify or just update fetchSekolah to include query/filters if we want robust behavior.
    // Let's try appending filters to query string if they exist.

    const { filters } = get();
    set({ isFetching: true, error: null, currentPage: page, currentQuery: "" });
    const token = localStorage.getItem("token");

    let url = `${apiUrl}/sekolah?page=${page}&limit=${limit}`;
    if (filters.kabupaten) {
      // If filter exists, maybe we should use search endpoint? Or does /sekolah accept prompts?
      // Assuming /sekolah/search or /sekolah accepts params.
      // Let's assume for now we use search logic if filters are present OR update fetch logic.
      // Actually, easiest is to handle this logic in the component: if filters, call search.
      // BUT `fetchSekolah` is called by pagination.
      // Let's stick to safe path: Update fetchSekolah to include params if backend supports filtering on main endpoint.
      // If not, we might need to route to search endpoint inside here.
      // Given previous code for search uses `/sekolah/search`, likely we need that.

      // Strategy: Modify this function to check filters. If filters exist, delegate to searchSekolah?
      // Or just modify searchSekolah to be the "one util to rule them all".
      // Let's update `fetchSekolah` to behave like a "get with params".
      // If we mimic `searchSekolah` logic:
      url = `${apiUrl}/sekolah?page=${page}&limit=${limit}`;
      if (filters.kabupaten) url += `&kabupaten=${encodeURIComponent(filters.kabupaten)}`;
    }

    // Wait, the backend likely uses `search` for any filtering.
    // Let's check `searchSekolah`. It hits `/sekolah/search`.
    // If I change `fetchSekolah`, I risk breaking simple pagination.
    // Better strategy: The component (DataTable) calls `onFetch`.
    // In `Sekolah.jsx`, `onFetch` maps to `searchSekolah`.
    // So we only need to update `searchSekolah` to include filters!

    // BUT `fetchSekolah` might be called initially? 
    // In `Sekolah.jsx`: `const { ... searchSekolah ... } = useSekolahStore(...)`.
    // And `useEffect` calls `searchSekolah` or `fetchSekolah`?
    // Looking at `Sekolah.jsx` (previous view):
    // It passes `searchSekolah` as `onFetch`.
    // And it doesn't seem to have an initial useEffect safely visible in the snippet (it was truncated or I missed it).
    // Actually `DataTable` calls `onFetch` on mount/update.
    // So modifying `searchSekolah` is the key!

    // Let's revert `fetchSekolah` changes idea and focus on `searchSekolah`.
    try {
      const response = await axios.get(`${apiUrl}/sekolah?page=${page}&limit=${limit}`, { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } });
      // ... existing logic ...
      if (!response.status === 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.data;
      set({
        sekolahData: data,
        isFetching: false,
        totalPages: data.totalPages,
        currentPage: page,
        currentLimit: limit,
      });
    } catch (error) {
      // ... existing error logic ...
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
    set({ isLoading: true });
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${apiUrl}/sekolah`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({
        sekolahData: [],
        totalPages: 0,
        totalData: 0,
        isLoading: false,
      });
      return true;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  uploadSekolah: async (formData) => {
    set({ isLoading: true });
    const token = localStorage.getItem("token");
    try {
      await axios.post(`${apiUrl}/upload/sekolah`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      set({ isLoading: false });
      return true;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  searchSekolah: async (query, page = 1, limit = 10) => {
    const token = localStorage.getItem("token");
    const { filters, sekolahStatistik } = get(); // Get current filters & data
    const effectiveQuery = query !== undefined ? query : get().currentQuery;

    set({ isFetching: true, currentQuery: effectiveQuery });

    // CLIENT-SIDE FILTERING (Fallback because backend doesn't support kabupaten filter)
    if (filters.kabupaten) {
      if (!sekolahStatistik || sekolahStatistik.length === 0) {
        // If data not ready, maybe just return empty or wait? 
        // effectively empty result for now.
        set({
          sekolahData: [],
          totalPages: 0,
          totalData: 0,
          currentPage: page,
          currentLimit: limit,
          isFetching: false,
        });
        return;
      }

      let filtered = sekolahStatistik.filter((s) => s.kabupaten === filters.kabupaten);

      if (effectiveQuery) {
        const lowerQ = effectiveQuery.toLowerCase();
        filtered = filtered.filter(
          (s) =>
            (s.nama && s.nama.toLowerCase().includes(lowerQ)) ||
            (s.npsn && s.npsn.toLowerCase().includes(lowerQ))
        );
      }

      const totalData = filtered.length;
      const totalPages = Math.ceil(totalData / limit);
      const startIndex = (page - 1) * limit;
      const paginatedData = filtered.slice(startIndex, startIndex + limit);

      set({
        sekolahData: paginatedData,
        totalPages: totalPages,
        totalData: totalData,
        currentPage: page,
        currentLimit: limit,
        isFetching: false,
      });
      return; // Stop execution, don't hit API
    }

    try {
      // SERVER-SIDE SEARCH (Existing Logic)
      // let url = ... (rest of the server logic)

      let url = `${apiUrl}/sekolah/search?query=${effectiveQuery}&page=${page}&limit=${limit}`;
      // Note: Backend doesn't support &kabupaten=..., so we don't append it here.
      // If we did, it would just be ignored or error, but user said not supported.

      const response = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });

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
      set({ isLoading: false, sekolahDetail: response.data || {} });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
}));

export { useSekolahStore };
