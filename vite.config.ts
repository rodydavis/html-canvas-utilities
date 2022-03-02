import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/html-canvas-utilities/",
  build: {
    rollupOptions: {
      input: "index.html",
    },
  },
});
