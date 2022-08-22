import Controller from '../../controller/webhook.js'

export default function webhookRoute(app) {
  app.post('/api/webhooks', Controller.process)
}
