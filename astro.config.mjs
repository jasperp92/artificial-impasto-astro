// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import svelte from "@astrojs/svelte";
import tailwindcss from "@tailwindcss/vite";
import rehypeTableLabels from "./src/plugins/rehype-table-labels.js";
import AutoImport from 'astro-auto-import';

// https://astro.build/config
export default defineConfig({
  integrations: [
    AutoImport({
      imports: [
        // Import a component’s default export
        // generates:
        // import A from './src/components/A.astro';
        './src/components/Reference.astro',
        './src/components/PageNav.astro',
      ],
    }),
    mdx(),
    svelte(),
  ],

  base: "/artificial-impasto",

  markdown: {
    rehypePlugins: [rehypeTableLabels],
  },

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@layouts": "/src/layouts",
        "@components": "/src/components",
        "@styles": "/src/styles",
        "@images": "/src/assets/images",
        "@data": "/src/data",
      },
    },
  },
});
