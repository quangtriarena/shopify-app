import apiCaller from '../helpers/apiCaller'

const auth = async () => {
  return await apiCaller('/api/store-settings')
}

const update = async (data) => {
  return await apiCaller('/api/store-settings', 'PUT', data)
}

const StoreSettingApi = { auth, update }

export default StoreSettingApi
