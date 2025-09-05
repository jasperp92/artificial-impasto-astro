import { defineConfig } from 'tailwindcss'
import typography from '@tailwindcss/typography'

export default defineConfig({
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {},
  },
  plugins: [typography],   // hier aktivieren
  darkMode: 'class', // wichtig!
})