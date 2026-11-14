import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: process.env.OPENAPI_INPUT || "http://localhost:8000/openapi.json",
  output: {
    path: "src/client",
    format: "prettier",
  },
  plugins: ["@hey-api/client-fetch"],
});
