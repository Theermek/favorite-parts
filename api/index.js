// Serverless-прокси для продакшена (Vercel): обслуживает путь /api.
// Делает то же, что dev-прокси из vite.config.js — подставляет ключ покупателя,
// чтобы он оставался на сервере и не попадал в клиентский бандл.
const UPSTREAM = 'https://api.favorit-parts.ru/hs/hsprice/'

export default async function handler(req, res) {
  const key = process.env.FAVORIT_API_KEY
  if (!key) {
    return res.status(500).json({ error: 'FAVORIT_API_KEY не задан на сервере' })
  }

  const params = new URLSearchParams(req.query)
  params.set('key', key)

  try {
    const upstream = await fetch(`${UPSTREAM}?${params}`)
    // Тело отдаём как есть: разбор ошибок и пустышек живёт в src/api/favoritApi.js.
    const body = await upstream.text()
    res.status(upstream.status)
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.setHeader('Cache-Control', 'no-store')
    res.send(body)
  } catch {
    // Форма { error } — та же, что у API, поэтому клиент покажет её в alert.
    res.status(502).json({ error: 'Не удалось связаться с сервисом поставщика' })
  }
}
