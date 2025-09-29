import { defineConfig } from "tailwindcss";
import typography from "@tailwindcss/typography";

export default defineConfig({
  content: [
    "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
    "./src/utils/tailwind-safelist.html", // Dummy-Datei einbinden
  ],
  theme: {
    extend: {},
  },
  plugins: [
    typography,
    // Custom Variants
    function ({ addVariant }) {
      addVariant("presentation", ".mode-presentation &");
      addVariant("reading", ".mode-reading &");
    },
  ],
  darkMode: "class", // wichtig!
  safelist: [
    {
      pattern: /(columns)-(1|2|3|4|5|6|7|8|9|10|11|12)/,
    },
  ],
});
