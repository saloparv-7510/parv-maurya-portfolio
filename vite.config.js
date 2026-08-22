import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Where the site is served from.
  //   • Local dev, Netlify, and the Capacitor APK all serve from the domain
  //     root, so the default '/' is correct and nothing changes for them.
  //   • GitHub Pages serves this repo at /parv-maurya-portfolio/, so the
  //     Pages workflow sets VITE_BASE to that subpath before building.
  // Vite rewrites index.html and every hashed asset URL to match.
  base: process.env.VITE_BASE ?? '/',
  server: {
    port: 5173,
    open: true,
  },
  build: {
    target: 'es2020',
    // Split the animation libs out so the initial bundle stays small and fast.
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          motion: ['framer-motion'],
          gsap: ['gsap'],
        },
      },
    },
  },
})
