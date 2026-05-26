// eslint-disable-next-line no-unused-vars
function errorHandler (err, req, res, next) {
  const status = err.status || 500
  res.status(status).json({ error: err.message || 'Internal Server Error' })
}

module.exports = errorHandler
