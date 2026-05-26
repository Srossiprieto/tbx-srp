const { expect } = require('chai')
const request = require('supertest')
const createApp = require('../src/app')

const app = createApp()

describe('OpenAPI docs', () => {
  it('GET /docs.json expone la especificación OpenAPI', async () => {
    const res = await request(app).get('/docs.json').expect(200)
    expect(res.body.openapi).to.match(/^3\./)
    expect(res.body.paths).to.have.property('/files/data')
  })

  it('GET /docs/ sirve la UI de Swagger', async () => {
    await request(app).get('/docs/').expect(200)
  })
})
