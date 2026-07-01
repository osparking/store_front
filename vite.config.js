import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // 브라우저에서 process.env를 참조할 수 있도록 빈 객체로 정의
    "process.env": {},
  },
});
