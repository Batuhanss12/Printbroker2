import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client/src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173,
      host: "0.0.0.0"
    },
    watch: {
      usePolling: true,
      interval: 1000
    }
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      input: "./client/index.html",
    },
  },
});