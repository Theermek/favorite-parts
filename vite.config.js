import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Прокси нужен по двум причинам:
// 1. CORS — API отвечает без нужных заголовков, браузер не пустит запрос напрямую.
// 2. Ключ — подставляем его здесь, поэтому он не попадает в клиентский код.
// Третий аргумент '' у loadEnv разрешает переменные без префикса VITE_
// (переменные с VITE_ Vite встраивает в бандл — там ключу не место).
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const key = env.FAVORIT_API_KEY || ''

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: 'http://api.favorit-parts.ru',
          changeOrigin: true,
          rewrite: (path) => {
            const query = path.slice(path.indexOf('?') + 1)
            return `/hs/hsprice/?${query}&key=${encodeURIComponent(key)}`
          },
        },
      },
    },
  }
})
