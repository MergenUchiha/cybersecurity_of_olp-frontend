import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:6000",
        changeOrigin: true,
      },
      "/video-socket": {
        target: "http://localhost:6000",
        changeOrigin: true,
        ws: true,
        secure: false,
      },
    },
  },
  preview: {
    port: 5002,
    host: true,
    strictPort: false,
  },
});
