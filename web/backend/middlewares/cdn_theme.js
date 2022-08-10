import validateParams from '../helpers/validateParams.js'
import AssetMiddleware from './asset.js'
import ThemeMiddleware from './theme.js'

const NAME = 'CDN_THEME (DO NOT DELETE)'

const load = async ({ shop, accessToken }) => {
  try {
    validateParams({ shop, accessToken })

    let themes = await ThemeMiddleware.find({ shop, accessToken })
    themes = themes.themes

    let cdnTheme = themes.find((item) => item.name === NAME)

    if (!cdnTheme) {
      cdnTheme = ThemeMiddleware.create({ shop, accessToken, data: { theme: { name: NAME } } })
    }

    return cdnTheme
  } catch (error) {
    throw error
  }
}

const upload = async ({ shop, accessToken, asset }) => {
  try {
    validateParams({ shop, accessToken, asset })

    let themes = await ThemeMiddleware.find({ shop, accessToken })
    themes = themes.themes

    let cdnTheme = themes.find((item) => item.name === NAME)

    if (!cdnTheme) {
      cdnTheme = ThemeMiddleware.create({ shop, accessToken, data: { theme: { name: NAME } } })
    }

    return await AssetMiddleware.save({
      shop,
      accessToken,
      theme_id: cdnTheme.id,
      data: { asset },
    })
  } catch (error) {
    throw error
  }
}

const CdnThemeMiddleware = { load, upload }

export default CdnThemeMiddleware
