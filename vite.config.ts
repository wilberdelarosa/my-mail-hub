import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
<<<<<<< Updated upstream
import { componentTagger } from "lovable-tagger";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
=======

export default defineConfig(async ({ mode }) => {
  let tagger: any = null;

  if (mode === 'development') {
    const { componentTagger } = await import("lovable-tagger");
    tagger = componentTagger();
  }

  return {
    server: {
      host: "::",
      port: 8080,
>>>>>>> Stashed changes
    },
    plugins: [
      react(),
      tagger,
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
