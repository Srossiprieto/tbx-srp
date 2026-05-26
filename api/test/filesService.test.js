const { expect } = require('chai')
const createFilesService = require('../src/services/filesService')

const HEX = 'd33a8ca5d36d3106219f66f939774cf5'

describe('filesService', () => {
  it('descarga, formatea y omite archivos sin líneas válidas', async () => {
    const client = {
      listFiles: async () => ['file1.csv', 'empty.csv'],
      downloadFile: async (name) =>
        name === 'file1.csv' ? `file,text,number,hex\nfile1.csv,RgTya,64075909,${HEX}` : ''
    }

    const data = await createFilesService(client).getFilesData()
    expect(data).to.have.lengthOf(1)
    expect(data[0].file).to.equal('file1.csv')
  })

  it('no falla si un archivo no se puede descargar', async () => {
    const client = {
      listFiles: async () => ['ok.csv', 'broken.csv'],
      downloadFile: async (name) => {
        if (name === 'broken.csv') throw new Error('download error')
        return `file,text,number,hex\nok.csv,Hi,10,${HEX}`
      }
    }

    const data = await createFilesService(client).getFilesData()
    expect(data).to.have.lengthOf(1)
    expect(data[0].file).to.equal('ok.csv')
  })

  it('filtra por fileName', async () => {
    const client = {
      listFiles: async () => ['a.csv', 'b.csv'],
      downloadFile: async (name) => `file,text,number,hex\n${name},T,1,${HEX}`
    }

    const data = await createFilesService(client).getFilesData('b.csv')
    expect(data).to.have.lengthOf(1)
    expect(data[0].file).to.equal('b.csv')
  })
})
