const createApp = require('./app')
const config = require('./config')

createApp().listen(config.port, () => {
  console.log(`API escuchando en el puerto ${config.port}`)
})
