// Слой работы с API Favorit Parts.
// Все запросы идут на /api — это dev-прокси из vite.config.js,
// он добавляет ключ покупателя и решает CORS.

// Если деталь не найдена, API отдаёт не пустой массив, а один элемент-пустышку
// с таким goodsID. Такие записи отбрасываем.
const EMPTY_GOODS_ID = '00000000-0000-0000-0000-000000000000'

// Один запрос к API: собирает query, разбирает ответ и отдаёт чистый массив goods.
async function request(params) {
  const query = Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&')

  const response = await fetch(`/api?${query}`)

  let data
  try {
    data = await response.json()
  } catch {
    throw new Error('Сервис вернул неожиданный ответ')
  }

  // Порядок важен: текст ошибки приходит и с HTTP 200, и с HTTP 403,
  // поэтому сначала читаем тело, а уже потом смотрим на статус.
  if (data && data.error) throw new Error(data.error)
  if (!response.ok) throw new Error(`Ошибка запроса (${response.status})`)

  const goods = Array.isArray(data?.goods) ? data.goods : []
  return goods.filter((item) => item.goodsID !== EMPTY_GOODS_ID)
}

// Этап 1: по артикулу получаем уникальные бренды.
export async function fetchBrandsRequest(number) {
  const goods = await request({ number })
  return [...new Set(goods.map((item) => item.brand).filter(Boolean))]
}

// Этап 2: по артикулу и бренду получаем саму деталь и её аналоги,
// развёрнутые в плоские строки «товар × склад».
export async function fetchOffersRequest(number, brand) {
  const goods = await request({ number, brand, analogues: 'on' })
  // analogues лежит внутри самого товара и возвращается только вместе с brand.
  const items = goods.flatMap((item) => [item, ...(item.analogues || [])])
  return items.flatMap(toRows)
}

// Одна строка таблицы = одно предложение (товар на конкретном складе).
// Товар без складов даёт одну строку с пометкой «нет в наличии».
function toRows(item) {
  const base = {
    goodsID: item.goodsID,
    name: item.name,
    brand: item.brand,
    number: item.number,
  }

  if (!item.warehouses?.length) {
    return [{ ...base, id: `${item.goodsID}-none`, inStock: false }]
  }

  return item.warehouses.map((warehouse, index) => ({
    ...base,
    id: `${item.goodsID}-${warehouse.id}-${index}`,
    inStock: true,
    // Цену берём только из склада: goods.price по доке устарел.
    price: warehouse.price,
    stock: warehouse.stock,
    warehouse: warehouse.code || warehouse.id,
    shipmentDate: warehouse.shipmentDate,
  }))
}
