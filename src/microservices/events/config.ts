import * as env from 'env-var'

export const getConfig = () => ({
  port: env.get('PORT').default(3000).asPortNumber(),
  kafka: {
    brokers: env.get('KAFKA_BROKERS').required().asArray(','),
    topics: env.get('KAFKA_TOPICS').default('user-events,movie-events,payment-events').asArray(','),
    groupId: env.get('KAFKA_GROUP_ID').default('event-group-id').asString()
  }
})
