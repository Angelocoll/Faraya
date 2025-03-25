import { defineConfig } from "vite";

export default defineConfig({
  server: {
    // proxy: {
    //   '/wa-api': {
    //     target: 'https://app.waiteraid.com', // API-url
    //     changeOrigin: true,
    //     secure: false, // För osäkra certifikat
    //   },
    // },
  },
});
