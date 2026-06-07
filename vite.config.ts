import { defineConfig } from "vite";
import eslint from "vite-plugin-eslint2";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { visualizer } from "rollup-plugin-visualizer";
import babel from "@rolldown/plugin-babel";

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  plugins: [
    react(),
    babel({
      presets: [reactCompilerPreset()],
    }),
    eslint(),
    tailwindcss(),
    visualizer({
      open: true, // auto-opens in browser after build
      gzipSize: true, // shows gzipped sizes
      brotliSize: true, // shows brotli sizes
      filename: "dist/stats.html",
    }),
  ],
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

          if (
            id.includes("node_modules/react/") ||
            id.includes("node_modules/react-dom/") ||
            id.includes("node_modules/scheduler/")
          )
            return "vendor-react";

          if (id.includes("react-hook-form")) return "vendor-forms";
          if (id.includes("react-toastify")) return "vendor-ui";
          if (id.includes("react-router")) return "vendor-router";
          if (id.includes("lucide-react")) return "vendor-ui";

          if (id.includes("node_modules")) return "vendor-misc";
        },
      },
    },
  },
});
