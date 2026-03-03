import { create } from "zustand";
import axios from "axios";
import { useUserStore } from "@/features/users/stores/useUserStore";

const apiUrl = import.meta.env.VITE_API_URL;

const useUserTeamStore = create((set, get) => ({
    userTeams: [],
    isLoading: false,
    error: null,

    fetchUserTeams: async () => {
        const token = localStorage.getItem("token");
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get(`${apiUrl}/user-team`, {
                headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
            });
            set({
                userTeams: response.data?.data || [],
                isLoading: false,
            });
        } catch (error) {
            console.error("Failed to fetch User Teams:", error);
            set({
                isLoading: false,
                error: error.response?.data?.message || error.message || "Gagal memuat data tim",
                userTeams: [],
            });
            if (error.response?.status === 401) useUserStore.getState().logout();
        }
    },

    insertUserTeam: async (payload) => {
        const token = localStorage.getItem("token");
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${apiUrl}/user-team`, payload, {
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            });
            set({ isLoading: false });
            await get().fetchUserTeams();
            return response.data;
        } catch (error) {
            set({ isLoading: false, error: error.response?.data?.message || error.message });
            throw error;
        }
    },

    updateUserTeam: async (id, payload) => {
        const token = localStorage.getItem("token");
        set({ isLoading: true, error: null });
        try {
            const response = await axios.put(`${apiUrl}/user-team/${id}`, payload, {
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            });
            set({ isLoading: false });
            await get().fetchUserTeams();
            return response.data;
        } catch (error) {
            set({ isLoading: false, error: error.response?.data?.message || error.message });
            throw error;
        }
    },

    deleteUserTeam: async (id) => {
        const token = localStorage.getItem("token");
        set({ isLoading: true, error: null });
        try {
            const response = await axios.delete(`${apiUrl}/user-team/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            set({ isLoading: false });
            await get().fetchUserTeams();
            return response.data;
        } catch (error) {
            set({ isLoading: false, error: error.response?.data?.message || error.message });
            throw error;
        }
    },
}));

export { useUserTeamStore };
