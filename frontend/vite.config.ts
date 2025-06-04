// frontend/vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  root: 'frontend',
  plugins: [react()],
  css: {
    postcss: path.resolve(__dirname, '../postcss.config.js'), // ✅ point to root
  },
  build: {
    outDir: '../dist',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
