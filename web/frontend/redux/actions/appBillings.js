import BillingApi from '../../apis/billing'
import slices from '../slices'

export const getAppBillings = async (dispatch) => {
  try {
    let res = await BillingApi.get()
    if (!res.success) throw res.error

    return dispatch(slices.appBillings.actions.setData(res.data))
  } catch (error) {
    throw error
  }
}
