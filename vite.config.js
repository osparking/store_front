import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { visualizer } from "rollup-plugin-visualizer";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // 브라우저에서 process.env를 참조할 수 있도록 빈 객체로 정의
    "process.env": {},
  },
  build: {
    target: "es2020", // 최신 브라우저 대상
    modulePreload: {
      polyfill: false, // 폴리필 제거
      resolveDependencies: (filename, deps) => {
        return deps.filter(
          (dep) =>
            !dep.includes("recharts-vendor") &&
            !dep.includes("lodash") &&
            !dep.includes("useQuillMediaHandlers"),
        );
      },
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("recharts") || id.includes("d3-")) {
            return "recharts-vendor";
          }
          if (id.includes("lodash")) return "lodash";
          if (id.includes("quill")) return "quill-vendor";
          // ...
        },
      },
    },
  },
});
