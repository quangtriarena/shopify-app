import Controller from './../../controller/billing.js'

export default function billingRoute(app) {
  app.get('/api/billings', Controller.get)
  app.post('/api/billings', Controller.create)
}
