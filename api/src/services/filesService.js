const defaultClient = require('../clients/externalApiClient')
const { parseCsv } = require('../parsers/csvParser')
const logger = require('../utils/logger')

// Factory con inyección de dependencias: en test cliente falso
function createFilesService (client = defaultClient) {
  async function getFilesList () {
    return client.listFiles()
  }

  async function getFilesData (fileName) {
    const allFiles = await client.listFiles()
    const targetFiles = fileName ? allFiles.filter((file) => file === fileName) : allFiles

    // Descargas en paralelo; un archivo que falla no tumba la respuesta.
    const results = await Promise.allSettled(
      targetFiles.map(async (file) => parseCsv(await client.downloadFile(file), file))
    )

    const formatted = []
    results.forEach((result, index) => {
      const file = targetFiles[index]
      if (result.status === 'rejected') {
        logger.warn(`No se pudo procesar "${file}": ${result.reason.message}`)
        return
      }
      if (result.value.lines.length === 0) {
        logger.warn(`Archivo "${file}" sin líneas válidas, se omite`)
        return
      }
      formatted.push(result.value)
    })
    return formatted
  }

  return { getFilesList, getFilesData }
}

module.exports = createFilesService
