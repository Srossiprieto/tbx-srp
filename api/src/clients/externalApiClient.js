const axios = require('axios')
const config = require('../config')

// Único módulo que conoce la URL y la API key del API externo (patrón Gateway).
const http = axios.create({
  baseURL: config.externalApi.baseUrl,
  headers: { authorization: `Bearer ${config.externalApi.apiKey}` },
  timeout: config.externalApi.timeout
})

// Sólo nombre de archivo: letras, números, punto, guion y guion bajo.
// Evita path traversal (../) y barras que rompan la URL.
const SAFE_FILE_NAME = /^[\w.-]+$/

function isValidFileName (fileName) {
  return typeof fileName === 'string' && SAFE_FILE_NAME.test(fileName)
}

async function listFiles () {
  const { data } = await http.get('/secret/files')
  return data && Array.isArray(data.files) ? data.files : []
}

async function downloadFile (fileName) {
  if (!isValidFileName(fileName)) {
    const error = new Error(`Nombre de archivo inválido: "${fileName}"`)
    error.status = 400
    throw error
  }
  const { data } = await http.get(`/secret/file/${fileName}`, {
    transformResponse: [(raw) => raw]
  })
  return typeof data === 'string' ? data : String(data)
}

module.exports = { listFiles, downloadFile, isValidFileName }
