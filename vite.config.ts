import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";

export default defineConfig({
  plugins: [react(), basicSsl()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    https: {},
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
