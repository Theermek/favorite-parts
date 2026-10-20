import { createSlice } from '@reduxjs/toolkit'

const initialState = { number: '' }

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {},
})

export default searchSlice.reducer
