import { defineConfig } from "vite";

export default defineConfig({
  server: {
    proxy: {
      "/wa-api": {
        target: "https://app.waiteraid.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
