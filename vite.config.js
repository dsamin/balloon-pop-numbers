import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/balloon-pop-numbers/',
  optimizeDeps: {
    include: ['react-confetti', 'react-particles', 'tsparticles']
  }
})
