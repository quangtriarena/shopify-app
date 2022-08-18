import Controller from './../../controller/product.js'

export default function productRoute(app) {
  app.get('/api/products/count', Controller.count)
  app.get('/api/products', Controller.find)
  app.get('/api/products/:id', Controller.findById)
  app.post('/api/products', Controller.create)
  app.put('/api/products/:id', Controller.update)
  app.delete('/api/products/:id', Controller.delete)
}
