import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "13.125.165.201",
    port: 5173,
  },
  esbuild: {
    logOverride: { "unused variable": "silent" },
    loader: "tsx",
  },
});
