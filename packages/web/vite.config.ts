import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  root: 'src',
  publicDir: '../public',
  plugins: [react()],
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        assetFileNames: '[name]-[hash][extname]',
        chunkFileNames: '[name]-[hash].js',
        entryFileNames: '[name]-[hash].js',
        manualChunks(id: string): string | undefined {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/') || id.includes('node_modules/react-router')) {
            return 'vendor-react'
          }
          if (id.includes('node_modules/@mui/') || id.includes('node_modules/@emotion/')) {
            return 'vendor-mui'
          }
          if (id.includes('node_modules/@tanstack/react-query')) {
            return 'vendor-query'
          }
          if (id.includes('node_modules/dayjs')) {
            return 'vendor-dates'
          }
        },
      },
    },
  },
  server: {
    proxy: {
      '/assets/icons': {
        target: 'https://d1568c842iynon.cloudfront.net',
        changeOrigin: true,
      },
    },
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['../testSetup.ts'],
    css: false,
    pool: 'vmThreads',
    useAtomics: true,
    deps: {
      optimizer: {
        web: {
          enabled: true,
          include: [
            'react',
            'react-dom',
            'react-dom/client',
            '@emotion/react',
            '@emotion/styled',
            '@mui/material',
            '@mui/icons-material',
            '@mui/x-date-pickers',
            '@testing-library/react',
            '@testing-library/dom',
            '@testing-library/user-event',
            '@testing-library/jest-dom',
            '@tanstack/react-query',
            'react-router',
            'react-oidc-context',
            'oidc-client-ts',
            'date-fns',
          ],
        },
      },
    },
    coverage: {
      provider: 'v8',
      reportsDirectory: '../.coverage',
    },
  },
})
