import typescript from "rollup-plugin-typescript2"; // 处理typescript
import babel from "@rollup/plugin-babel";

export default {
  input: "./src/y-websocket.ts",
  external: (id) => /^(lib0|yjs|y-protocols)/.test(id),
  plugins: [
    typescript()
  ],
  output: [
    {
      name: "y-websocket",
      file: "dist/y-websocket.cjs",
      format: "cjs",
      sourcemap: true,
      dir: "dist",
      paths: (path) => {
        if (/^lib0\//.test(path)) {
          return `lib0/dist${path.slice(4)}.cjs`;
        } else if (/^y-protocols\//.test(path)) {
          return `y-protocols/dist${path.slice(11)}.cjs`;
        }
        return path;
      },
      
    },
  ],
};
