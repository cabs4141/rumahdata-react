import { create } from "zustand";

const STORAGE_KEY = "site_settings";

const DEFAULTS = {
    siteTitle: "RUMAH DATA",
    siteSubtitle: "BGTK NTB",
    logoUrl: "/images/logo/sd.png",
    siteTitleColor: "#1976d2",
    siteSubtitleColor: "#9ca3af",
};

const loadFromStorage = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return { ...DEFAULTS, ...JSON.parse(stored) };
        }
    } catch (e) {
        console.error("Failed to load site settings:", e);
    }
    return { ...DEFAULTS };
};

const saveToStorage = (state) => {
    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
                siteTitle: state.siteTitle,
                siteSubtitle: state.siteSubtitle,
                logoUrl: state.logoUrl,
                siteTitleColor: state.siteTitleColor,
                siteSubtitleColor: state.siteSubtitleColor,
            })
        );
    } catch (e) {
        console.error("Failed to save site settings:", e);
    }
};

export const useSettingsStore = create((set, get) => ({
    ...loadFromStorage(),

    updateTitle: (siteTitle) => {
        set({ siteTitle });
        saveToStorage({ ...get(), siteTitle });
    },

    updateSubtitle: (siteSubtitle) => {
        set({ siteSubtitle });
        saveToStorage({ ...get(), siteSubtitle });
    },

    updateLogo: (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const logoUrl = reader.result;
                set({ logoUrl });
                saveToStorage({ ...get(), logoUrl });
                resolve(logoUrl);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    },

    saveAll: ({ siteTitle, siteSubtitle, logoUrl, siteTitleColor, siteSubtitleColor }) => {
        const updates = {};
        if (siteTitle !== undefined) updates.siteTitle = siteTitle;
        if (siteSubtitle !== undefined) updates.siteSubtitle = siteSubtitle;
        if (logoUrl !== undefined) updates.logoUrl = logoUrl;
        if (siteTitleColor !== undefined) updates.siteTitleColor = siteTitleColor;
        if (siteSubtitleColor !== undefined) updates.siteSubtitleColor = siteSubtitleColor;
        set(updates);
        saveToStorage({ ...get(), ...updates });
    },

    resetDefaults: () => {
        set({ ...DEFAULTS });
        saveToStorage(DEFAULTS);
    },
}));
