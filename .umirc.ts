import { defineConfig } from "umi";

export default defineConfig({
  routes: [
    { path: "/", component: "index" },
    { path: "/docs", component: "docs" },
    { path: "/enhanced-formula-final", component: "enhanced-formula-final" },
  ],
  npmClient: 'pnpm',
});
