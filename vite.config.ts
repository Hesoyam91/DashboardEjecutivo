import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3333,
    strictPort: false, // Si 3333 está ocupado, busca el siguiente disponible
  },
})
