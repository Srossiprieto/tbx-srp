module.exports = {
  port: process.env.PORT || 3000,
  externalApi: {
    baseUrl: process.env.EXTERNAL_API_URL || 'https://echo-serv.tbxnet.com/v1',
    apiKey: process.env.EXTERNAL_API_KEY || 'aSuperSecretKey',
    timeout: Number(process.env.EXTERNAL_API_TIMEOUT) || 15000
  }
}
