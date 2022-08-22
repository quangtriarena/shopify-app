import StoreSettingApi from '../../apis/store_setting'
import slices from '../slices'

export const getStoreSetting = async (dispatch) => {
  try {
    let res = await StoreSettingApi.auth()
    if (!res.success) throw res.error

    return dispatch(slices.storeSetting.actions.setData(res.data))
  } catch (error) {
    throw error
  }
}

export const updateStoreSetting = async (dispatch, data) => {
  try {
    let res = await StoreSettingApi.update(data)
    if (!res.success) throw res.error

    return dispatch(slices.storeSetting.actions.setData(res.data))
  } catch (error) {
    throw error
  }
}
