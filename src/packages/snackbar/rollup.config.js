import { terser } from "rollup-plugin-terser";

export default {
  input: "src/snackbar.js",
  output: {
    file: "dist/snackbar.min.js",
    format: "esm",
    name: "Snackbar",
  },
  plugins: [terser()],
};
