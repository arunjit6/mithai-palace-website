// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://mithaipalace.example', // replace with the real domain at launch
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
});
