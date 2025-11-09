import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'DuneAI',
      formats: ['es', 'iife'],
      fileName: (format) => (format === 'iife' ? 'dune.js' : 'index.mjs')
    },
    rollupOptions: {
      // externalize deps here if you add runtime deps later
      external: [],
      output: {
        globals: {}
      }
    }
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
    'process.env': {}, // Fallback for any other accidental uses
  },
  plugins: [
    dts({ insertTypesEntry: true }) // generate d.ts
  ],
  server: {
    port: 5173,
    strictPort: true
  }
});
