import Controller from '../../controller/submition.js'

export default function submitionRoute(app) {
  app.get('/api/submition', Controller.submit)
}
