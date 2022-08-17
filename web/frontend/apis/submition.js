import apiCaller from '../helpers/apiCaller'

const create = async () => {
  return await apiCaller('/api/test-api')
}

const SubmitionApi = { create }

export default SubmitionApi
