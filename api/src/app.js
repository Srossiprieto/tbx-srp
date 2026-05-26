const express = require('express')
const cors = require('cors')
const swaggerUi = require('swagger-ui-express')
const createFilesRouter = require('./routes/filesRoutes')
const errorHandler = require('./middlewares/errorHandler')
const openapiSpec = require('./docs/openapi')

function createApp () {
  const app = express()
  app.use(cors())
  app.use(express.json())
  app.get('/health', (req, res) => res.json({ status: 'ok' }))
  app.use('/files', createFilesRouter())

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec))
  app.get('/docs.json', (req, res) => res.json(openapiSpec))

  app.use(errorHandler)
  return app
}

module.exports = createApp
