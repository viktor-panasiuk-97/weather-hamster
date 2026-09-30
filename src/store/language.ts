import i18n, { getDeviceLanguage, type Language } from "@/i18n";
import { zustandStorage } from "@/store/storage";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type LanguageState = {
  language: Language;
  setLanguage: (language: Language) => void;
};

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: getDeviceLanguage(),
      setLanguage: (language) => {
        set({ language });
        i18n.changeLanguage(language);
      },
    }),
    {
      name: "language",
      storage: zustandStorage,
      partialize: (state) => ({ language: state.language }),
      onRehydrateStorage: () => (state) => {
        if (state) i18n.changeLanguage(state.language);
      },
    },
  ),
);
