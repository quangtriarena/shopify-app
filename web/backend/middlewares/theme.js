import apiCaller from '../helpers/apiCaller.js'
import validateParams from '../helpers/validateParams.js'

const getMain = async ({ shop, accessToken }) => {
  try {
    validateParams({ shop, accessToken })

    let themes = await apiCaller({
      shop,
      accessToken,
      endpoint: `themes.json`,
    })
    themes = themes.themes

    let theme = themes.find((item) => item.role === 'main')
    if (!theme) {
      throw new Error('Not found')
    }

    return theme
  } catch (error) {
    throw error
  }
}

const find = async ({ shop, accessToken }) => {
  try {
    validateParams({ shop, accessToken })

    return await apiCaller({
      shop,
      accessToken,
      endpoint: `themes.json`,
    })
  } catch (error) {
    throw error
  }
}

const findById = async ({ shop, accessToken, id }) => {
  try {
    validateParams({ shop, accessToken, id })

    return await apiCaller({
      shop,
      accessToken,
      endpoint: `themes/${id}.json`,
    })
  } catch (error) {
    throw error
  }
}
const create = async ({ shop, accessToken, data }) => {
  try {
    validateParams({ shop, accessToken, data })

    return await apiCaller({
      shop,
      accessToken,
      endpoint: `themes.json`,
      method: 'POST',
      data,
    })
  } catch (error) {
    throw error
  }
}

const update = async ({ shop, accessToken, id, data }) => {
  try {
    validateParams({ shop, accessToken, id, data })

    return await apiCaller({
      shop,
      accessToken,
      endpoint: `themes/${id}.json`,
      method: 'PUT',
      data,
    })
  } catch (error) {
    throw error
  }
}

const _delete = async ({ shop, accessToken, id }) => {
  try {
    validateParams({ shop, accessToken, id })

    return await apiCaller({
      shop,
      accessToken,
      endpoint: `themes/${id}.json`,
      method: 'DELETE',
    })
  } catch (error) {
    throw error
  }
}

const ThemeMiddleware = {
  getMain,
  find,
  findById,
  create,
  update,
  delete: _delete,
}

export default ThemeMiddleware
