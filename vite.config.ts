import { defineConfig } from "vite";
import eslint from "vite-plugin-eslint2";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  plugins: [react(), eslint(), tailwindcss()],
  server: {
    host: true,
    port: 3001,
    open: true,
  },
  build: {
    cssCodeSplit: true,
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("@supabase")) return "vendor-supabase";
          if (id.includes("@tanstack/react-query")) return "vendor-query";
          if (id.includes("@tanstack/react-router")) return "vendor-router";
          if (id.includes("node_modules/react")) return "vendor-react";
          if (id.includes("react-toastify")) return "vendor-ui";
        },
      },
    },
  },
});
