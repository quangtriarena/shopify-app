import Controller from './../../controller/background_job.js'

export default function backgroundJobRoute(app) {
  app.get('/api/background-jobs', Controller.find)
  app.get('/api/background-jobs/:id', Controller.findById)
  app.put('/api/background-jobs/:id', Controller.update)
  app.delete('/api/background-jobs/:id', Controller.delete)
}
