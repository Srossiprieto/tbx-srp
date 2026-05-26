const { Router } = require('express')
const createFilesController = require('../controllers/filesController')

function createFilesRouter (controller = createFilesController()) {
  const router = Router()
  router.get('/data', controller.getData)
  router.get('/list', controller.getList)
  return router
}

module.exports = createFilesRouter
