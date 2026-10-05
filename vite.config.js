import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import purgecss from "vite-plugin-purgecss";

export default defineConfig({
  plugins: [
    react(),
    purgecss({
      content: ["./src/**/*.{js,jsx,ts,tsx,html}"],
      safelist: [
        // Bootstrap 동적 클래스
        /^btn-/,
        /^col-/,
        /^row-/,
        /^modal-/,
        /^dropdown-/,
        /^nav-/,
        /^card-/,
        /^alert-/,
        /^badge-/,
        /^form-/,
        /^input-/,
        /^table-/,
        /^list-/,
        /^toast-/,
        /^offcanvas-/,
        /^accordion-/,
        /^carousel-/,
        /^tooltip-/,
        /^popover-/,
        /^progress-/,
        /^spinner-/,
        /^pagination-/,
        /^breadcrumb-/,
        /^close-/,
        /^fade$/,
        /^show$/,
        /^active$/,
        /^disabled$/,
        /^collapse$/,
        /^collapsing$/,
        /^collapsed$/,
        /^modal-open$/,
        /^d-/,
        /^p-/,
        /^m-/,
        /^text-/,
        /^bg-/,
        /^border-/,
        /^flex-/,
        /^justify-/,
        /^align-/,
        /^gap-/,
        /^w-/,
        /^h-/,
        /^position-/,
        /^top-/,
        /^bottom-/,
        /^start-/,
        /^end-/,
        /^translate-/,
        /^overflow-/,
        /^visually-hidden$/,
        /^clearfix$/,
        /^float-/,
        /^user-select-/,
        /^pointer-events-/,
        /^opacity-/,
        /^z-/,
      ],
    }),
  ],

  define: {
    "process.env": {},
  },
  build: {
    sourcemap: false,
    target: "es2020",
    modulePreload: {
      polyfill: false,
      resolveDependencies: (filename, deps) => {
        return deps.filter(
          (dep) =>
            !dep.includes("recharts-vendor") &&
            // !dep.includes("quill-vendor") &&
            !dep.includes("d3-vendor") &&
            !dep.includes("ui-vendor") &&
            !dep.includes("motion-vendor"),
        );
      },
    },
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
        manualChunks(id) {
          // ⭐ QuestionEditor 청크 (소스 + quill 의존성)
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
          const match = id.match(
            /node_modules[\\/](@[^\\/]+[\\/][^\\/]+|[^\\/]+)/,
          );
          if (!match) return;
          const pkg = match[1];

          // recharts
          if (pkg === "recharts" || pkg === "victory-vendor")
            return "recharts-vendor";
          if (pkg.startsWith("d3-")) return "d3-vendor";
          if (pkg === "lodash" || pkg === "lodash-es") return "lodash";
          if (
            pkg === "react-router" ||
            pkg === "react-router-dom" ||
            pkg.startsWith("@remix-run")
          ) {
            return "router-vendor";
          }
          if (
            pkg === "bootstrap" ||
            pkg === "react-bootstrap" ||
            pkg.startsWith("@restart")
          ) {
            return "bootstrap-vendor";
          }
          if (pkg === "axios") return "axios";
          if (["dayjs", "moment", "date-fns"].includes(pkg))
            return "date-vendor";

          // 나머지
          return "vendor";
        },
      },
    },
  },
});
