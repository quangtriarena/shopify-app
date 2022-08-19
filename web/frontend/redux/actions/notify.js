import slices from '../slices'

export const showNotify = (dispatch, data) => {
  return dispatch(slices.notify.actions.showNotify(data))
}

export const hideNotify = (dispatch) => {
  return dispatch(slices.notify.actions.hideNotify())
}
