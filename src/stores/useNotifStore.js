import { create } from "zustand";

const useNotificationStore = create((set) => ({
  open: false,
  message: "",
  severity: "success",

  showNotification: (message, severity = "success") => {
    set({ open: true, message, severity });
  },

  hideNotification: () => {
    // Tadi ada kesalahan penulisan di sini (koma setelah kurung kurawal)
    set({ open: false });
  },
}));
export { useNotificationStore };
