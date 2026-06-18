import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  integrations: [
    tailwind(),
    sitemap({
      filter: (page) =>
        !page.includes('/test-motion') &&
        !page.includes('/v2') &&
        !page.includes('/404'),
    }),
  ],
  site: 'https://electroloop.cl',
  devToolbar: { enabled: false },

  // ──────────────────────────────────────────
  // ETAPA 3.3: Performance Optimizations
  // ──────────────────────────────────────────

  // Output optimization
  output: 'static',

  // Vite config for build optimization
  vite: {
    build: {
      // Minify all assets
      minify: 'terser',

      // Optimize chunks
      rollupOptions: {
        output: {
          manualChunks: {
            // Separate vendor chunks
            'vendor-ui': ['@astrojs/tailwind'],
          },
        },
      },

      // CSS optimization
      cssCodeSplit: true,

      // Report compressed size
      reportCompressedSize: true,
    },

    // Image optimization
    ssr: {
      external: ['sharp'],
    },
  },

  // Compression settings
  compressHTML: true,

  // Asset handling
  assets: {
    maxUploadSize: 25, // MB
  },
});
