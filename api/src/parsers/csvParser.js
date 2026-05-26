const HEX_REGEX = /^[0-9a-f]{32}$/i
const HEADER = 'file,text,number,hex'

function parseLine (rawLine) {
  const parts = rawLine.split(',')
  if (parts.length !== 4) return null
  const [file, text, number, hex] = parts.map((part) => part.trim())
  if (!file || !text || !number || !hex) return null
  const parsedNumber = Number(number)
  if (!Number.isFinite(parsedNumber)) return null
  if (!HEX_REGEX.test(hex)) return null
  return { text, number: parsedNumber, hex }
}

function parseCsv (rawContent, fileName) {
  const lines = []
  if (typeof rawContent !== 'string' || rawContent.trim() === '') {
    return { file: fileName, lines }
  }
  for (const row of rawContent.split(/\r?\n/)) {
    const trimmed = row.trim()
    if (trimmed === '' || trimmed.toLowerCase() === HEADER) continue
    const parsed = parseLine(row)
    if (parsed) lines.push(parsed)
  }
  return { file: fileName, lines }
}

module.exports = { parseCsv, parseLine }
