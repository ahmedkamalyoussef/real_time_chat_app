import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
  },
  preview: {
    port: 4173,
    host: true,
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      "chatty-f.up.railway.app",
      ".railway.app",
      ".up.railway.app",
    ],
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          utils: ["axios", "zustand"],
        },
      },
    },
  },
  define: {
    global: "globalThis",
  },
});
