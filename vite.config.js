import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import glsl from "vite-plugin-glsl";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    glsl({
      include: ["**/*.glsl", "**/*.wgsl", "**/*.vert", "**/*.frag"],
    }),
  ],
  // Added this server block to tell external Browser to open automatically
  server: {
    open: true
  },
});
