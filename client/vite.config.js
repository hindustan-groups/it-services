import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    // Chunk warning limit — framer-motion is now only in lazy-loaded chunks (not initial bundle)
    // 600 covers large lazy pages: BlogPostPage (42KB), AboutPage (38KB), etc.
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Vite 8 (rolldown) requires manualChunks as a function
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('framer-motion')) return 'vendor-motion'
            if (id.includes('@tanstack')) return 'vendor-query'
            if (id.includes('react-hook-form') || id.includes('@hookform') || id.includes('zod'))
              return 'vendor-forms'
            if (id.includes('lucide-react')) return 'vendor-icons'
            if (id.includes('react-dom') || id.includes('react-router') || id.includes('/react/'))
              return 'vendor-react'
          }
        },
      },
    },
  },
})
