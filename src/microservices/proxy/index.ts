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
  if(req.url == '/api/proxy/health') {
    res.status(200)
    return;
  }


  const random = Math.random()
  if (gradualMigration && random < targetWeight) {
    console.log({ random, targetWeight, url: req.url, gradualMigration, moviesMigrationPercent }, 'to_microservice')
    apiProxy.web(req, res, { target: moviesServiceUrl })
    return;
  }

  console.log({ random, targetWeight, url: req.url, gradualMigration, moviesMigrationPercent }, 'to_monolith')
  apiProxy.web(req, res, { target: monolithUrl })
})

app.listen(port, () => {
  console.log(`Proxy Movies listening on port ${port}`)
})
