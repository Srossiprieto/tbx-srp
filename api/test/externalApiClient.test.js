const { expect } = require('chai')
const { isValidFileName } = require('../src/clients/externalApiClient')

describe('externalApiClient.isValidFileName', () => {
  it('acepta nombres de archivo normales', () => {
    expect(isValidFileName('file1.csv')).to.equal(true)
  })

  it('rechaza path traversal y barras', () => {
    expect(isValidFileName('../secret')).to.equal(false)
    expect(isValidFileName('a/b.csv')).to.equal(false)
    expect(isValidFileName('')).to.equal(false)
  })
})
