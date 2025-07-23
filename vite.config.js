import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  plugins: [react()],
  server: {
    port: 5000,
    host: true,
    proxy: {
      '/api': {
        target: 'http://192.168.1.16:7000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
});
