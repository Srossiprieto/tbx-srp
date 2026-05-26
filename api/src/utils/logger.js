// Logger mínimo. Se silencia en tests para no ensuciar la salida.
const silent = process.env.NODE_ENV === 'test'

module.exports = {
  info: (...args) => { if (!silent) console.log('[info]', ...args) },
  warn: (...args) => { if (!silent) console.warn('[warn]', ...args) },
  error: (...args) => { if (!silent) console.error('[error]', ...args) }
}
