import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  // Path alias — mirrors tsconfig.json paths
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // Dev server configuration
  server: {
    port: 3000,
    open: true,
    // Proxy API requests to Django backend in development
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },

  // Build optimization
  build: {
    outDir: 'dist',
    sourcemap: true,
    // Warn if a chunk exceeds 500KB
    chunkSizeWarningLimit: 500,
    // Split vendor chunks for better browser caching
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          // Core React
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router-dom')) {
            return 'vendor-react'
          }
          // State management
          if (id.includes('@reduxjs') || id.includes('react-redux') || id.includes('@tanstack')) {
            return 'vendor-state'
          }
          // UI / Animation
          if (id.includes('framer-motion') || id.includes('recharts')) {
            return 'vendor-ui'
          }
          // Drag & Drop
          if (id.includes('@dnd-kit')) {
            return 'vendor-dnd'
          }
        },
      },
    },
  },

  // Enable CSS source maps in dev
  css: {
    devSourcemap: true,
  },
})
