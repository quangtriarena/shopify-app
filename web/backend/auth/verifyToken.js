import { Shopify } from '@shopify/shopify-api'

export default async function verifyToken(req, res) {
  try {
    const session = await Shopify.Utils.loadCurrentSession(req, res, false)
    if (!session?.shop) {
      throw new Error('Unauthorized')
    }
    return session
  } catch (error) {
    throw new Error('Unauthorized')
  }
}
