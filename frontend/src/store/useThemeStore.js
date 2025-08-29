import { create } from "zustand";

const applyTheme = (theme) => {
  document.documentElement.setAttribute('data-theme', theme);
};

export const useThemeStore = create((set) => ({
  theme: (() => {
    const storedTheme = localStorage.getItem('theme') || 'winter';
    applyTheme(storedTheme);
    return storedTheme;
  })(),

  setTheme: (theme) => {
    localStorage.setItem('theme', theme);
    applyTheme(theme);
    set({ theme });
  },
}));