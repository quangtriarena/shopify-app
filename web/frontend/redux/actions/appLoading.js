import slices from '../slices'

export const showAppLoading = (dispatch) => {
  return dispatch(slices.appLoading.actions.showAppLoading())
}

export const hideAppLoading = (dispatch) => {
  return dispatch(slices.appLoading.actions.hideAppLoading())
}
