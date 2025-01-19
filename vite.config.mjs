import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  plugins: [],
  build: {
    target: "node16",
    outDir: "dist",
    rollupOptions: {
      input: path.resolve(__dirname, "src/server-express.ts"), // Specify your server entry file
      external: [
        "express", // Example: If you're using Express
      ],
    },
  },
  base: "./",
  server: {
    proxy: {
      "/api": {
        target: "http://192.168.1.133/api/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
