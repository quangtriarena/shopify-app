export default async function verifyToken(req, res, app, Shopify) {
  try {
    const session = await Shopify.Utils.loadCurrentSession(req, res, app.get('use-online-tokens'))
    if (!session?.shop) {
      throw new Error('Unauthorized')
    }
    return session
  } catch (error) {
    throw new Error('Unauthorized')
  }
}
