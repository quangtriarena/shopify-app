import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  data: {
    loading: false,
  },
}

export default createSlice({
  name: 'appLoading',
  initialState,
  reducers: {
    showAppLoading: (state, action) => {
      state.data = { ...initialState.data, loading: true }
    },
    hideAppLoading: (state, action) => {
      state.data = initialState.data
    },
  },
})
