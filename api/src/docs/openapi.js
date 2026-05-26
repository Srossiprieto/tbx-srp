const config = require('../config')

module.exports = {
  openapi: '3.0.3',
  info: {
    title: 'TBX Challenge API',
    version: '1.0.0',
    description: 'API REST que consume el API externo, descarga los CSV y los reformatea.'
  },
  servers: [{ url: `http://localhost:${config.port}` }],
  paths: {
    '/files/data': {
      get: {
        tags: ['files'],
        summary: 'Archivos formateados',
        description: 'Lista los archivos del API externo, los descarga y devuelve sus líneas válidas.',
        parameters: [
          {
            name: 'fileName',
            in: 'query',
            required: false,
            description: 'Filtra los datos de un único archivo (punto opcional).',
            schema: { type: 'string' },
            example: 'file1.csv'
          }
        ],
        responses: {
          200: {
            description: 'Lista de archivos formateados',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/FileData' } }
              }
            }
          }
        }
      }
    },
    '/files/list': {
      get: {
        tags: ['files'],
        summary: 'Lista cruda de archivos',
        description: 'Devuelve la lista de archivos disponibles tal cual la expone el API externo.',
        responses: {
          200: {
            description: 'Lista de archivos disponibles',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/FilesList' }
              }
            }
          }
        }
      }
    },
    '/health': {
      get: {
        tags: ['system'],
        summary: 'Healthcheck',
        responses: {
          200: {
            description: 'Estado del servicio',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { status: { type: 'string', example: 'ok' } }
                }
              }
            }
          }
        }
      }
    }
  },
  components: {
    schemas: {
      Line: {
        type: 'object',
        properties: {
          text: { type: 'string', example: 'RgTya' },
          number: { type: 'integer', example: 64075909 },
          hex: { type: 'string', example: '70ad29aacf0b690b0467fe2b2767f765' }
        }
      },
      FileData: {
        type: 'object',
        properties: {
          file: { type: 'string', example: 'file1.csv' },
          lines: { type: 'array', items: { $ref: '#/components/schemas/Line' } }
        }
      },
      FilesList: {
        type: 'object',
        properties: {
          files: {
            type: 'array',
            items: { type: 'string' },
            example: ['file1.csv', 'file2.csv']
          }
        }
      },
      Error: {
        type: 'object',
        properties: { error: { type: 'string' } }
      }
    }
  }
}
