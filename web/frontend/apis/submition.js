import apiCaller from '../helpers/apiCaller'

const submit = async () => {
  return await apiCaller(`/api/submition`)
}

const SubmitionApi = { submit }

export default SubmitionApi
