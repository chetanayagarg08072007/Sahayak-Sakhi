import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/Sahayak-Sakhi/", // GitHub Pages deployment
  plugins: [react()],
});
