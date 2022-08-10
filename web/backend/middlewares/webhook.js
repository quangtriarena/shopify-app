import apiCaller from '../helpers/apiCaller.js'

const create = async ({ shop, accessToken, topic }) => {
  try {
    return await apiCaller({
      shop,
      accessToken,
      endpoint: `webhooks.json`,
      method: 'POST',
      data: {
        webhook: {
          topic,
          address: process.env.BACKEND_URL + '/api/webhooks',
          format: 'json',
          fields: ['id'],
        },
      },
    })
      .then((res) => {
        // console.log(`Webhook ${topic} registered`)
      })
      .catch((err) => {
        // console.log(`Register webhook ${topic} failed: ${err.message}`)
      })
  } catch (error) {
    throw error
  }
}

const WebhookMiddleware = {
  create,
}

export default WebhookMiddleware
