import { Consumer, Kafka, Producer } from 'kafkajs'
import { KafkaCustomConfig } from './types/kafka.types'

export class KafkaClient extends Kafka {
  private readonly sender: Producer
  private readonly eater: Consumer
  private readonly topics: string[] = []

  public constructor (
    config: KafkaCustomConfig
  ) {
    super(config)
    this.sender = super.producer()
    this.eater = super.consumer({ groupId: config.groupId })
    this.topics = config.subscribeTopics
  }

  public async connect () {
    await this.sender.connect()
    await this.eater.connect()
    await this.eater.subscribe({ topics: this.topics, fromBeginning: true })

    await this.eater.run({
      eachMessage: async ({
        topic,
        partition,
        message
      }) => {
        console.log({
          topic,
          partition,
          offset: message.offset,
          value: message.value ? JSON.parse(message.value.toString()) : null
        }, `got_event_for_${topic}`)
      }
    })
  }

  public async disconnects () {
    await this.sender.disconnect()
    await this.eater.disconnect()
  }

  public async send (
    topic: string,
    messages: Record<string, unknown>
  ) {
    await this.sender.send({
      topic,
      messages: [{ value: JSON.stringify(messages) }]
    })
  }
}
