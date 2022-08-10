import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  show: false,
  error: false,
  message: '',
  onDismiss: undefined,
}

export const notifySlice = createSlice({
  name: 'notify',
  initialState,
  reducers: {
    showNotify: (state, action) => {
      state.show = true
      state.error = action.payload.error || false
      state.message = action.payload.message || ''
      state.onDismiss = action.payload.onDismiss || undefined
    },
    hideNotify: (state) => {
      state.show = false
      state.error = false
      state.message = ''
      state.onDismiss = undefined
    },
  },
})

export const { showNotify, hideNotify } = notifySlice.actions

export const selectNotify = (state) => state.notify

export default notifySlice.reducer
