import express from 'express';
import * as globalConfig from './config';

import { KafkaClient } from './kafka.client';

const app = express()
app.use(express.json());

const {
  port,
  kafka: kafkaConfig
} = globalConfig.getConfig()

let kafkaClient: KafkaClient;

async function bootstrap() {
  kafkaClient = new KafkaClient({
    groupId: kafkaConfig.groupId,
    subscribeTopics: kafkaConfig.topics,
    brokers: kafkaConfig.brokers,
    requestTimeout: 60000, // 60 секунд
    connectionTimeout: 10000, // 10 секунд
  })

  await kafkaClient.connect()
}

bootstrap().catch(console.error)

// app.use('/', (req, res, next) => {
//   console.debug({ body: req.body, url: req.url })
//   next()
// })

app.get('/api/events/health', (req, res) => {
  console.log({ healthcheck: 'ok'})
  res.send({ status: true })
})

app.post('/api/events/user', (req, res) => {
  kafkaClient.send(
    'user-events',
    req.body
  )
  console.log({ event: req.body }, 'user-events')

  res.status(201)
  res.send({ status: 'success' })
})

app.post('/api/events/movie', (req, res) => {
  kafkaClient.send(
    'movie-events',
    req.body
  )
  console.log({ event: req.body }, 'movie-events')

  res.status(201)
  res.send({ status: 'success' })
})

app.post('/api/events/payment', (req, res) => {
  kafkaClient.send(
    'payment-events',
    req.body
  )

  console.log({ event: req.body }, 'payment-events')

  res.status(201)
  res.send({ status: 'success' })
})

app.listen(port, () => {
  console.log(`Events Service listening on port ${port}`)
})
