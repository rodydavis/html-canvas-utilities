import { defineConfig } from "vite";
import { resolve } from "path";
import typescript from "rollup-plugin-typescript2";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: "build",
    lib: {
      entry: "src/controller/index.ts",
      name: "html-canvas-utilities",
    },
  },
  plugins: [
    typescript({
      check: true,
      tsconfig: resolve(__dirname, "tsconfig.json"),
      tsconfigOverride: {
        compilerOptions: {
          sourceMap: false,
          declaration: true,
          declarationMap: true,
        },
        include: ["src/controller/**/*.ts"],
        exclude: ["**/__tests__"],
      },
    }),
  ],
});
