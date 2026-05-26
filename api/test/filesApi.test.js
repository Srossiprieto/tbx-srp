const { expect } = require('chai')
const request = require('supertest')
const nock = require('nock')
const createApp = require('../src/app')
const config = require('../src/config')

const HEX = 'd33a8ca5d36d3106219f66f939774cf5'
const app = createApp()

describe('Endpoints /files', () => {
  afterEach(() => nock.cleanAll())

  it('GET /files/data responde 200 con la info formateada', async () => {
    nock(config.externalApi.baseUrl)
      .get('/secret/files').reply(200, { files: ['file1.csv'] })
      .get('/secret/file/file1.csv')
      .reply(200, `file,text,number,hex\nfile1.csv,RgTya,64075909,${HEX}`)

    const res = await request(app)
      .get('/files/data')
      .expect('Content-Type', /json/)
      .expect(200)

    expect(res.body).to.be.an('array').with.lengthOf(1)
    expect(res.body[0].file).to.equal('file1.csv')
    expect(res.body[0].lines[0]).to.deep.equal({ text: 'RgTya', number: 64075909, hex: HEX })
  })

  it('GET /files/data?fileName= filtra un archivo', async () => {
    nock(config.externalApi.baseUrl)
      .get('/secret/files').reply(200, { files: ['file1.csv', 'file2.csv'] })
      .get('/secret/file/file2.csv').reply(200, `file,text,number,hex\nfile2.csv,Hi,7,${HEX}`)

    const res = await request(app).get('/files/data?fileName=file2.csv').expect(200)
    expect(res.body).to.have.lengthOf(1)
    expect(res.body[0].file).to.equal('file2.csv')
  })

  it('GET /files/list devuelve la lista cruda del API externo', async () => {
    nock(config.externalApi.baseUrl).get('/secret/files').reply(200, { files: ['file1.csv'] })

    const res = await request(app).get('/files/list').expect(200)
    expect(res.body.files).to.deep.equal(['file1.csv'])
  })
})
