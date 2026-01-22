import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',          // слушаем на всех интерфейсах (Tailscale и т.д.)
    strictPort: true,
    allowedHosts: ['higu.su, .higu.su, server.higu.su', '.behired.ru'],

    hmr: {
      https: false,
      host: 'higu.su',     // именно твой домен
      // protocol: 'wss',        // обязательно wss, потому что Nginx Proxy Manager terminates TLS
    },
    proxy: {
      // Все запросы, которые начинаются с /api,
      // будут перенаправлены на твой бэкенд
      '/api': {
        target: 'http://server.higu.su',
        changeOrigin: true,           // меняет заголовок Host на target
        secure: false,                // если http, а не https
      }
    }
  },
})