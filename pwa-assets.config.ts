import { defineConfig } from "@vite-pwa/assets-generator/config";

export default defineConfig({
  headLinkOptions: {
    preset: "2023",
  },
  preset: {
    transparent: {
      sizes: [32, 128, 180, 192],
      favicons: [[48, "favicon.ico"]],
    },
    maskable: {
      sizes: [128, 192],
    },
    apple: {
      sizes: [180],
    },
  },
  images: ["public/logo-32x32.webp"], // Your source image
});
