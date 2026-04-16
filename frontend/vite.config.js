import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React core — cached across all routes
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // Recharts is large (~350KB), only loads when dashboard is visited
          'vendor-charts': ['recharts'],
          // Axios — small but separate for cache efficiency
          'vendor-axios': ['axios'],
        },
      },
    },
    // Raise the warning threshold since we're now properly splitting
    chunkSizeWarningLimit: 600,
  },
})
