import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  // vite.config.js

  build: {
    assetsInlineLimit: 0, // Förhindrar inline-assets, och de blir istället refererade via URL med en unik hash
    rollupOptions: {
      output: {
        assetFileNames: "[name]-[hash][extname]", // Aktiverar file hashing
      },
    },
  },

  plugins: [react()],
});
