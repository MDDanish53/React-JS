import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Proxy all requests starting with /v1 to Appwrite API server
      "/v1": {
        target: "https://fra.cloud.appwrite.io",
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
