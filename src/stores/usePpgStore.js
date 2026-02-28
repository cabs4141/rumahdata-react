import { create } from "zustand";
import axios from "axios";
import { useUserStore } from "./useUserStore";
const apiUrl = import.meta.env.VITE_API_URL;

const usePpgStore = create((set, get) => ({
    ppgData: [],
    isLoading: false,
    isFetching: false,
    error: null,
    totalPages: 0,
    totalData: 0,
    currentPage: 1,
    currentLimit: 10,
    currentQuery: "",
    abortController: null,
    filters: { kabupaten: "", tahap: "", tahun: "" },
    setFilters: (newFilters) => set((state) => ({ filters: { ...state.filters, ...newFilters } })),

    ppgStatistik: [],
    totalPpgStatistik: 0,
    isStatistikLoading: false,

    getStatistikPpg: async () => {
        const token = localStorage.getItem("token");
        set({ isStatistikLoading: true });
        try {
            // Step 1: ambil totalData dulu dengan limit kecil
            const countRes = await axios.get(`${apiUrl}/ppg?page=1&limit=1`, {
                headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
            });
            const totalData = countRes.data?.totalData || 0;

            if (totalData === 0) {
                set({ ppgStatistik: [], totalPpgStatistik: 0, isStatistikLoading: false });
                return;
            }

            // Step 2: fetch SEMUA record agar semua nilai tahap & kabupaten tersedia
            const response = await axios.get(`${apiUrl}/ppg?page=1&limit=${totalData}`, {
                headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
            });
            if (response.status === 200) {
                const data = response.data;
                set({
                    ppgStatistik: data.data || [],
                    totalPpgStatistik: totalData,
                    isStatistikLoading: false,
                });
            }
        } catch (error) {
            console.error("Failed to fetch statistik PPG:", error);
            set({ ppgStatistik: [], totalPpgStatistik: 0, isStatistikLoading: false });
        }
    },

    getPpg: async ({ page = 1, limit = 10, query = "" } = {}) => {
        const { abortController, filters } = get();
        if (abortController) {
            abortController.abort();
        }

        const newController = new AbortController();
        set({
            isFetching: true,
            error: null,
            currentPage: page,
            currentLimit: limit,
            currentQuery: query,
            abortController: newController,
        });

        const token = localStorage.getItem("token");

        // CLIENT-SIDE FILTERING by kota_kab_sekolah and/or tahap and/or tahun
        if (filters.kabupaten || filters.tahap || filters.tahun) {
            const { ppgStatistik } = get();
            if (!ppgStatistik || ppgStatistik.length === 0) {
                set({ ppgData: [], totalPages: 0, totalData: 0, isFetching: false, abortController: null });
                return;
            }

            let filtered = ppgStatistik.filter((p) => {
                const matchKab = filters.kabupaten ? p.kota_kab_sekolah === filters.kabupaten : true;
                const matchTahap = filters.tahap ? p.tahap === filters.tahap : true;
                const matchTahun = filters.tahun ? p.tahun?.toString() === filters.tahun?.toString() : true;
                return matchKab && matchTahap && matchTahun;
            });

            if (query) {
                const lowerQ = query.toLowerCase();
                filtered = filtered.filter(
                    (p) =>
                        (p.nama_lengkap && p.nama_lengkap.toLowerCase().includes(lowerQ)) ||
                        (p.no_ukg && p.no_ukg.toLowerCase().includes(lowerQ))
                );
            }

            const totalData = filtered.length;
            const totalPages = Math.ceil(totalData / limit);
            const startIndex = (page - 1) * limit;
            const paginatedData = filtered.slice(startIndex, startIndex + limit);

            set({
                ppgData: paginatedData,
                totalPages,
                totalData,
                currentPage: page,
                currentLimit: limit,
                isFetching: false,
                abortController: null,
            });
            return;
        }

        const url = query
            ? `${apiUrl}/ppg/search?keyword=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
            : `${apiUrl}/ppg?page=${page}&limit=${limit}`;

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
            set({
                ppgData: data.data || [],
                totalPages: data.totalPages || 0,
                totalData: data.totalData || 0,
                isFetching: false,
                abortController: null,
            });
        } catch (error) {
            if (axios.isCancel(error)) {
                console.log("Request canceled", error.message);
                return;
            }
            console.error("Failed to fetch PPG data:", error);
            set({
                isFetching: false,
                error: error.response?.data?.message || error.message || "Gagal memuat data PPG.",
                ppgData: [],
                abortController: null,
            });
            if (error.response?.status === 401) {
                useUserStore.getState().logout();
            }
        }
    },

    deletePpg: async () => {
        const { currentQuery, currentLimit, getPpg } = get();
        set({ isLoading: true });

        try {
            const token = localStorage.getItem("token");
            const response = await axios.delete(`${apiUrl}/ppg`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.status === 200) {
                set({ ppgData: [], totalPages: 0, currentPage: 1, isLoading: false });
                await getPpg({ page: 1, limit: currentLimit, query: currentQuery });
                return true;
            }
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    uploadPpg: async (payload) => {
        const { currentQuery, currentLimit, getPpg } = get();
        const token = localStorage.getItem("token");
        try {
            set({ isLoading: true });
            const response = await axios.post(`${apiUrl}/upload/ppg`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });
            await getPpg({ page: 1, limit: currentLimit, query: currentQuery });
            set({ isLoading: false });
            return response.status === 200;
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },
}));

export { usePpgStore };
