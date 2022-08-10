import apiCaller from '../helpers/apiCaller'

const get = async () => {
  return await apiCaller(`/api/billings`)
}

const create = async (id) => {
  return await apiCaller(`/api/billings`, 'POST', { id })
}

const BillingApi = { get, create }

export default BillingApi
