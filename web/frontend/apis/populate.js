import apiCaller from '../helpers/apiCaller'

const create = async () => {
  return await apiCaller(`/api/pupolate`, 'POST')
}

const PopulateApi = {
  create,
}

export default PopulateApi
