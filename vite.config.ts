import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
