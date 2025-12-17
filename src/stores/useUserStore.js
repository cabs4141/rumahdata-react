// src/stores/useUserStore.js
import { create } from "zustand";

// Mendefinisikan struktur state awal dan fungsi (actions)
export const useUserStore = create((set) => ({
  // --- STATE ---
  isLoggedIn: false,
  userInfo: null,

  // Action untuk login
  login: (userData) =>
    set((state) => ({
      isLoggedIn: true,
      userInfo: userData,
    })),

  // Action untuk logout
  logout: () =>
    set({
      isLoggedIn: false,
      userInfo: null,
    }),

  // Action untuk update nama (contoh modifikasi state)
  updateUserName: (newName) =>
    set((state) => ({
      userInfo: {
        ...state.userInfo,
        name: newName, // Pastikan userInfo tidak null sebelum diakses
      },
    })),
}));
