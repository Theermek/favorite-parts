import { useState } from 'react'
import { useSelector } from 'react-redux'
import Loader from './Loader.jsx'
import ErrorAlert from './ErrorAlert.jsx'

// Ответ с аналогами бывает очень большим (встречалось 15 000+ предложений),
// поэтому показываем строки порциями, иначе вкладка подвисает на отрисовке.
const PAGE_SIZE = 100

const priceFormat = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
})

function formatDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString('ru-RU')
}

export default function OffersTable() {
  const [visible, setVisible] = useState(PAGE_SIZE)
  const offers = useSelector((state) => state.search.offers)

  if (offers.status === 'idle') return null
  if (offers.status === 'loading') return <Loader text="Загружаем предложения…" />
  if (offers.status === 'failed') return <ErrorAlert message={offers.error} />
  if (!offers.rows.length) {
    return <div className="alert alert-secondary my-3">Ничего не найдено</div>
  }

  const rows = offers.rows.slice(0, visible)

  return (
    <section className="my-4">
      <h2 className="h5">Предложения</h2>
      <div className="table-responsive">
        {/* table-bordered даёт вертикальные разделители между колонками.
            Текстовые колонки выравниваем влево, числовые вправо: так цены и
            остатки сравниваются взглядом по разряду. */}
        <table className="table table-sm table-striped table-bordered align-middle">
          <thead>
            <tr>
              <th className="text-start">Название</th>
              <th className="text-start">Производитель</th>
              <th className="text-start">Артикул</th>
              <th className="text-end">Цена</th>
              <th className="text-end">Остаток</th>
              <th className="text-start">Склад</th>
              <th className="text-start">Дата отгрузки</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className={row.inStock ? undefined : 'text-secondary'}>
                <td className="text-start">{row.name}</td>
                <td className="text-start">{row.brand}</td>
                <td className="text-start">{row.number}</td>
                <td className="text-end">
                  {row.inStock ? priceFormat.format(row.price) : '—'}
                </td>
                <td className="text-end">
                  {row.inStock ? row.stock : <span className="badge text-bg-light">нет в наличии</span>}
                </td>
                <td className="text-start">{row.inStock ? row.warehouse : '—'}</td>
                <td className="text-start">{row.inStock ? formatDate(row.shipmentDate) : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="d-flex align-items-center gap-3">
        <span className="text-secondary small">
          Показано {rows.length} из {offers.rows.length}
        </span>
        {visible < offers.rows.length && (
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={() => setVisible(visible + PAGE_SIZE)}
          >
            Показать ещё {PAGE_SIZE}
          </button>
        )}
      </div>
    </section>
  )
}
