import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBrands } from '../store/searchSlice.js'

export default function SearchForm() {
  const [value, setValue] = useState('')
  const dispatch = useDispatch()
  const status = useSelector((state) => state.search.brands.status)

  // Поиск только по кнопке или Enter — бережём квоту запросов к API.
  function handleSubmit(event) {
    event.preventDefault()
    const number = value.trim()
    if (number) dispatch(fetchBrands(number))
  }

  return (
    <form className="row g-2 align-items-center" onSubmit={handleSubmit}>
      <div className="col-sm">
        <label className="form-label" htmlFor="number">
          Артикул детали
        </label>
        <input
          id="number"
          className="form-control"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Например, 7160500039S"
          autoComplete="off"
        />
      </div>
      <div className="col-sm-auto align-self-end">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={status === 'loading' || !value.trim()}
        >
          Найти
        </button>
      </div>
    </form>
  )
}
