// // vite.config.js
// import { defineConfig } from "vite";
// import vue from "@vitejs/plugin-vue";

// // console.log('✅ Vite config loaded!')

// export default defineConfig({
//   plugins: [vue()],
//   server: {
//     port: 5173,
//     proxy: {
//       "/movies": "http://localhost:8080",
//       "/comments": "http://localhost:8080", // ← 必须有这一行！
//     },
//   },
// });

// vite.config.js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
      "/movies": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});
