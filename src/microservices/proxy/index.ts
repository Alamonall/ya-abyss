import express from 'express'
import httpProxy from 'http-proxy'
import * as globalConfig from './config'

const app = express()

const {
  port,
  monolithUrl,
  moviesServiceUrl,
  gradualMigration,
  moviesMigrationPercent
} = globalConfig.getConfig()

const apiProxy = httpProxy.createProxyServer()
const targetWeight = moviesMigrationPercent / 100

app.use('/', (req, res) => {
  console.log({ url: req.url, gradualMigration, moviesMigrationPercent });

  if(req.url == '/health') {
    res.status(200)
    res.send();
  }

  const random = Math.random()
  if (gradualMigration && random < targetWeight) {
    console.log({ random, targetWeight, }, 'to_microservice')
    apiProxy.web(req, res, { target: moviesServiceUrl })
    return;
  }

  console.log({ random, targetWeight}, 'to_monolith')
  apiProxy.web(req, res, { target: monolithUrl })
})

app.listen(port, () => {
  console.log(`Proxy Movies listening on port ${port}`)
})
