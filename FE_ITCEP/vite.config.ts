import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { devProxy } from './vite.proxy'

export default defineConfig({
  plugins: [tailwindcss(), react()],
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg', '**/*.webp'],
  server: {
    proxy: devProxy,
  },
})
