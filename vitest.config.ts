/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import solid from "vite-plugin-solid";

export default defineConfig({
  plugins: [solid()],
  test: {
    environment: "jsdom",
    globals: true,
    transformMode: {
      web: [/\.[jt]sx?$/],
    },
     deps: {
      optimizer: {
        web: {
          include: ['solid-js']
        }
      }
    }
  },
  resolve: {
    conditions: ["development", "browser"],
  },
});
