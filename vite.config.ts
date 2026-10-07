// vite.config.js
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],  // purgecss 제거
  define: {
    "process.env": {},
  },
  build: {
    cssCodeSplit: false,
    sourcemap: false,
    target: "es2020",
    modulePreload: {
      polyfill: false,
      resolveDependencies: (filename, deps) => {
        return deps.filter(
          (dep) =>
            !dep.includes("recharts-vendor") &&
            !dep.includes("d3-vendor") &&
            !dep.includes("ui-vendor") &&
            !dep.includes("motion-vendor")
        );
      },
    },
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
        manualChunks(id) {
          if (id.endsWith(".css")) return;

          if (
            id.includes("component/user/question/QuestionEditor") ||
            id.includes("node_modules/quill/") ||
            id.includes("node_modules/quill-delta/") ||
            id.includes("node_modules/parchment/") ||
            id.includes("node_modules/quill-") ||
            id.includes("node_modules/react-quill")
          ) {
            return "question-editor";
          }

          if (!id.includes("node_modules")) return;
          const match = id.match(/node_modules[\\/](@[^\\/]+[\\/][^\\/]+|[^\\/]+)/);
          if (!match) return;
          const pkg = match[1];

          if (pkg === "recharts" || pkg === "victory-vendor") return "recharts-vendor";
          if (pkg.startsWith("d3-")) return "d3-vendor";
          if (pkg === "lodash" || pkg === "lodash-es") return "lodash";
          if (
            pkg === "react-router" ||
            pkg === "react-router-dom" ||
            pkg.startsWith("@remix-run")
          ) {
            return "router-vendor";
          }
          if (pkg === "axios") return "axios";
          if (["dayjs", "moment", "date-fns"].includes(pkg)) return "date-vendor";

          return "vendor";
        },
      },
    },
  },
});