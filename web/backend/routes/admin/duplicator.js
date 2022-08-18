import MulterUpload from '../../connector/multer/index.js'
import Controller from './../../controller/duplicator.js'

export default function duplicatorRoute(app) {
  app.get('/api/duplicator-packages', Controller.get)
  app.post('/api/duplicator-check-code', Controller.checkCode)
  app.post('/api/duplicator-export', Controller.export)
  app.post('/api/duplicator-import', MulterUpload.array('files', 20), Controller.import)
}
