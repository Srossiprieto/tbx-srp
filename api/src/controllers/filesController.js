const createFilesService = require('../services/filesService')

function createFilesController (service = createFilesService()) {
  async function getData (req, res, next) {
    try {
      res.json(await service.getFilesData(req.query.fileName))
    } catch (err) {
      next(err)
    }
  }

  async function getList (req, res, next) {
    try {
      res.json({ files: await service.getFilesList() })
    } catch (err) {
      next(err)
    }
  }

  return { getData, getList }
}

module.exports = createFilesController
