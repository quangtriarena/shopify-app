import Controller from './../../controller/duplicator.js'

export default function duplicatorRoute(app) {
  app.put('/api/duplicator/:id', Controller.update)
  app.delete('/api/duplicator/:id', Controller.delete)
  app.get('/api/duplicator-packages', Controller.get)
  app.get('/api/duplicator-duplicator-packages', Controller.getByDuplicator)
  app.post('/api/duplicator-check-code', Controller.checkCode)
  app.post('/api/duplicator-export', Controller.export)
  app.post('/api/duplicator-import', Controller.import)
}
