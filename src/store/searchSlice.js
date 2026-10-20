import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchBrandsRequest, fetchOffersRequest } from '../api/favoritApi.js'

// Этап 1: артикул -> список брендов.
export const fetchBrands = createAsyncThunk('search/fetchBrands', (number) =>
  fetchBrandsRequest(number)
)

// Этап 2: артикул + бренд -> предложения по детали и её аналогам.
export const fetchOffers = createAsyncThunk('search/fetchOffers', ({ number, brand }) =>
  fetchOffersRequest(number, brand)
)

const initialState = {
  number: '',
  brands: { status: 'idle', items: [], error: null, requestId: null },
  selectedBrand: null,
  offers: { status: 'idle', rows: [], error: null, requestId: null },
}

function resetOffers(state) {
  state.selectedBrand = null
  state.offers = { status: 'idle', rows: [], error: null, requestId: null }
}

// Ответ устаревшего запроса не должен перезаписывать результат нового:
// сравниваем requestId, который RTK кладёт в action.meta.
function isCurrent(section, action) {
  return section.requestId === action.meta.requestId
}

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    selectBrand(state, action) {
      state.selectedBrand = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBrands.pending, (state, action) => {
        state.number = action.meta.arg
        state.brands.status = 'loading'
        state.brands.error = null
        state.brands.requestId = action.meta.requestId
        // Новый поиск сбрасывает выбранный бренд и таблицу.
        resetOffers(state)
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        if (!isCurrent(state.brands, action)) return
        state.brands.status = 'succeeded'
        state.brands.items = action.payload
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        if (!isCurrent(state.brands, action)) return
        state.brands.status = 'failed'
        state.brands.items = []
        state.brands.error = action.error.message
      })
      .addCase(fetchOffers.pending, (state, action) => {
        state.selectedBrand = action.meta.arg.brand
        state.offers.status = 'loading'
        state.offers.error = null
        state.offers.requestId = action.meta.requestId
      })
      .addCase(fetchOffers.fulfilled, (state, action) => {
        if (!isCurrent(state.offers, action)) return
        state.offers.status = 'succeeded'
        state.offers.rows = action.payload
      })
      .addCase(fetchOffers.rejected, (state, action) => {
        if (!isCurrent(state.offers, action)) return
        state.offers.status = 'failed'
        state.offers.rows = []
        state.offers.error = action.error.message
      })
  },
})

export const { selectBrand } = searchSlice.actions
export default searchSlice.reducer
