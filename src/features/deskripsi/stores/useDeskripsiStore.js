import { create } from "zustand";
import axios from "axios";
import { useUserStore } from "@/features/users/stores/useUserStore";
const apiUrl = import.meta.env.VITE_API_URL;

const useDeskripsiStore = create((set) => ({
    deskripsi: "",
    isLoading: false,

    getDeskripsi: async () => {
        set({ isLoading: true });
        const token = localStorage.getItem("token");
        try {
            const response = await axios.get(`${apiUrl}/deskripsi`, { 
                headers: { 
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json" 
                } 
            });
            set({ deskripsi: response.data.isi, isLoading: false });
        } catch (error) {
            console.error("Failed to fetch deskripsi:", error);
            set({ isLoading: false });
            // Don't logout on failure here since it might just be uninitialized
        }
    },

    updateDeskripsi: async (isi) => {
        set({ isLoading: true });
        const token = localStorage.getItem("token");
        try {
            await axios.put(`${apiUrl}/deskripsi`, { isi }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            set({ deskripsi: isi, isLoading: false });
            return true;
        } catch (error) {
            console.error("Failed to update deskripsi:", error);
            set({ isLoading: false });
            throw error;
        }
    }
}));

export { useDeskripsiStore };
