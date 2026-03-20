import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  root: 'src',
  publicDir: '../public',
  plugins: [react()],
  build: {
    outDir: '../dist',
    emptyOutDir: true,
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
    environment: 'jsdom',
    setupFiles: ['../testSetup.ts'],
    css: false,
    coverage: {
      provider: 'v8',
      reportsDirectory: '../.coverage',
    },
  },
})
