import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  data: null,
}

export const storeSettingSlice = createSlice({
  name: 'storeSetting',
  initialState,
  reducers: {
    setStoreSetting: (state, action) => {
      state.data = action.payload
    },
  },
})

export const { setStoreSetting } = storeSettingSlice.actions

export const selectStoreSetting = (state) => state.storeSetting.data

export default storeSettingSlice.reducer
