import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const FRONTEND_PORT = parseInt(process.env.FRONTEND_PORT || '3100', 10)
const BACKEND_PORT = parseInt(process.env.BACKEND_PORT || '4100', 10)

export default defineConfig({
  plugins: [react()],
  server: {
    port: FRONTEND_PORT,
    strictPort: false,
    proxy: {
      '/api': `http://localhost:${BACKEND_PORT}`
    }
  }
})
