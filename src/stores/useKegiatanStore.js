import { create } from "zustand";
import axios from "axios";
import { useUserStore } from "./useUserStore";
const apiUrl = import.meta.env.VITE_API_URL;

const useKegiatanStore = create((set, get) => ({
    kegiatanData: [],
    isLoading: false,
    isFetching: false,
    error: null,
    totalPages: 0,
    totalData: 0,
    currentPage: 1,
    currentLimit: 10,
    currentQuery: "",
    abortController: null,


    // Lightweight: hanya update totalData, tidak menyentuh kegiatanData/currentLimit
    fetchTotalKegiatan: async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await axios.get(`${apiUrl}/kegiatan?page=1&limit=1`, {
                headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
            });
            const totalData = res.data?.totalData || 0;
            set({ totalData });
        } catch (error) {
            console.error("Failed to fetch total kegiatan:", error);
        }
    },


    getKegiatan: async ({ page = 1, limit = 10, query = "" } = {}) => {
        const { abortController } = get();
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

        const url = query
            ? `${apiUrl}/kegiatan/search?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
            : `${apiUrl}/kegiatan?page=${page}&limit=${limit}`;

        try {
            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
                signal: newController.signal,
            });

            if (response.status !== 200) throw new Error(`HTTP error! status: ${response.status}`);

            const data = response.data;
            set({
                kegiatanData: data.data || [],
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
            console.error("Failed to fetch Kegiatan data:", error);
            set({
                isFetching: false,
                error: error.response?.data?.message || error.message || "Gagal memuat data kegiatan.",
                kegiatanData: [],
                abortController: null,
            });
            if (error.response?.status === 401) useUserStore.getState().logout();
        }
    },

    insertKegiatan: async (payload) => {
        const token = localStorage.getItem("token");
        set({ isLoading: true });
        try {
            const response = await axios.post(`${apiUrl}/kegiatan`, payload, {
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            });
            set({ isLoading: false });
            const { currentLimit, getKegiatan } = get();
            await getKegiatan({ page: 1, limit: currentLimit, query: "" });
            return response.data;
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    deleteKegiatanById: async (id) => {
        const token = localStorage.getItem("token");
        set({ isLoading: true });
        try {
            const response = await axios.delete(`${apiUrl}/kegiatan/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            set({ isLoading: false });
            const { currentPage, currentLimit, currentQuery, getKegiatan } = get();
            await getKegiatan({ page: currentPage, limit: currentLimit, query: currentQuery });
            return response.data;
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    deleteAllKegiatan: async () => {
        const token = localStorage.getItem("token");
        set({ isLoading: true });
        try {
            const response = await axios.delete(`${apiUrl}/kegiatan`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.status === 200) {
                set({ kegiatanData: [], totalPages: 0, currentPage: 1, isLoading: false });
                return true;
            }
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    uploadKegiatan: async (payload) => {
        const { currentQuery, currentLimit, getKegiatan } = get();
        const token = localStorage.getItem("token");
        set({ isLoading: true });
        try {
            const response = await axios.post(`${apiUrl}/upload/kegiatan`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });
            await getKegiatan({ page: 1, limit: currentLimit, query: currentQuery });
            set({ isLoading: false });
            return response.status === 200;
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },
}));

export { useKegiatanStore };
