import { useDispatch, useSelector } from 'react-redux'
import { fetchOffers } from '../store/searchSlice.js'
import Loader from './Loader.jsx'
import ErrorAlert from './ErrorAlert.jsx'

export default function BrandList() {
  const dispatch = useDispatch()
  const { number, selectedBrand, brands } = useSelector((state) => state.search)

  if (brands.status === 'idle') return null
  if (brands.status === 'loading') return <Loader text="Ищем производителей…" />
  if (brands.status === 'failed') return <ErrorAlert message={brands.error} />
  if (!brands.items.length) {
    return <div className="alert alert-secondary my-3">Ничего не найдено</div>
  }

  return (
    <section className="my-4">
      <h2 className="h5">Производители</h2>
      <div className="d-flex flex-wrap gap-2">
        {brands.items.map((brand) => (
          <button
            key={brand}
            type="button"
            className={`btn btn-sm ${
              brand === selectedBrand ? 'btn-primary' : 'btn-outline-primary'
            }`}
            onClick={() => dispatch(fetchOffers({ number, brand }))}
          >
            {brand}
          </button>
        ))}
      </div>
    </section>
  )
}
