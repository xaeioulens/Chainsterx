import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react":    ["react", "react-dom"],
          "vendor-wagmi":    ["wagmi", "viem", "@wagmi/core"],
          "vendor-rainbow":  ["@rainbow-me/rainbowkit"],
          "vendor-wallets":  ["@metamask/sdk"],
        },
      },
    },
  },
  server: {
    port: 5173,
    host: "0.0.0.0",
  },
  test: {
    globals: true,
    environment: "node",
  },
});
