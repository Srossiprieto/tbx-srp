const { expect } = require('chai')
const { parseCsv } = require('../src/parsers/csvParser')

describe('csvParser', () => {
  it('parsea líneas válidas y arma el schema pedido', () => {
    const raw = [
      'file,text,number,hex',
      'file1.csv,RgTya,64075909,70ad29aacf0b690b0467fe2b2767f765'
    ].join('\n')

    expect(parseCsv(raw, 'file1.csv')).to.deep.equal({
      file: 'file1.csv',
      lines: [{ text: 'RgTya', number: 64075909, hex: '70ad29aacf0b690b0467fe2b2767f765' }]
    })
  })

  it('descarta líneas con datos faltantes', () => {
    const raw = [
      'file,text,number,hex',
      'file1.csv,soloTexto',
      'file1.csv,Ok,6,d33a8ca5d36d3106219f66f939774cf5'
    ].join('\n')

    const result = parseCsv(raw, 'file1.csv')
    expect(result.lines).to.have.lengthOf(1)
    expect(result.lines[0].text).to.equal('Ok')
  })

  it('descarta líneas con hex inválido', () => {
    expect(parseCsv('file1.csv,Bad,5,noEsHex', 'file1.csv').lines).to.have.lengthOf(0)
  })

  it('maneja archivos vacíos', () => {
    expect(parseCsv('', 'empty.csv')).to.deep.equal({ file: 'empty.csv', lines: [] })
  })
})
