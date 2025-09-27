import { KafkaConfig } from 'kafkajs'

export type KafkaCustomConfig = KafkaConfig & {
  groupId: string
  subscribeTopics: string[]
}
