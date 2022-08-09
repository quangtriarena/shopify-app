import apiCaller from '../helpers/apiCaller.js'
import validateParams from '../helpers/validateParams.js'
import ThemeMiddleware from './theme.js'

const find = async ({ shop, accessToken, theme_id }) => {
  try {
    validateParams({ shop, accessToken })

    let themeId = theme_id
    if (!themeId) {
      themeId = await ThemeMiddleware.getMain({ shop, accessToken })
      themeId = themeId.id
    }

    return await apiCaller({
      shop,
      accessToken,
      endpoint: `themes/${themeId}/assets.json`,
    })
  } catch (error) {
    throw error
  }
}

const findByKey = async ({ shop, accessToken, theme_id, key }) => {
  try {
    validateParams({ shop, accessToken, key })

    let themeId = theme_id
    if (!themeId) {
      themeId = await ThemeMiddleware.getMain({ shop, accessToken })
      themeId = themeId.id
    }

    return await apiCaller({
      shop,
      accessToken,
      endpoint: `themes/${themeId}/assets.json?asset[key]=${key}`,
    })
  } catch (error) {
    throw error
  }
}

const save = async ({ shop, accessToken, theme_id, data }) => {
  try {
    validateParams({ shop, accessToken, data })

    let themeId = theme_id
    if (!themeId) {
      themeId = await ThemeMiddleware.getMain({ shop, accessToken })
      themeId = themeId.id
    }

    return await apiCaller({
      shop,
      accessToken,
      endpoint: `themes/${themeId}/assets.json`,
      method: 'PUT',
      data,
    })
  } catch (error) {
    throw error
  }
}

const _delete = async ({ shop, accessToken, theme_id, key }) => {
  try {
    validateParams({ shop, accessToken, key })

    let themeId = theme_id
    if (!themeId) {
      themeId = await ThemeMiddleware.getMain({ shop, accessToken })
      themeId = themeId.id
    }

    return await apiCaller({
      shop,
      accessToken,
      endpoint: `themes/${themeId}/assets.json?asset[key]=${key}`,
      method: 'DELETE',
    })
  } catch (error) {
    throw error
  }
}

const AssetMiddleware = {
  find,
  findByKey,
  save,
  delete: _delete,
}

export default AssetMiddleware
