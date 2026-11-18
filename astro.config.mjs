import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://estudiolacamera.com.ar',
  base: process.env.ASTRO_BASE || '/',
  output: 'static',
  integrations: [tailwind({
    applyBaseStyles: false,
  })],
  compressHTML: true,
});
