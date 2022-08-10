import CdnThemeMiddleware from './cdn_theme.js'

export default async ({ shop, accessToken, type, value }) => {
  try {
    let fileName = `duplicator_${type}_${Date.now()}.csv`
    let assetKey = `assets/${fileName}`
    let asset = { key: assetKey, value: value }

    return await CdnThemeMiddleware.upload({ shop, accessToken, asset })
  } catch (error) {
    throw error
  }
}
