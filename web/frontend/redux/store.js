import { configureStore } from '@reduxjs/toolkit'
import notify from './reducers/notify'
import appLoading from './reducers/appLoading'
import storeSetting from './reducers/storeSetting'

export const store = configureStore({
  reducer: {
    notify,
    appLoading,
    storeSetting,
  },
})
