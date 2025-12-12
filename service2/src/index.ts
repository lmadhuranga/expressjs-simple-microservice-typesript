import { connect, ChannelModel, Channel, ConsumeMessage } from 'amqplib';

const SERVICE_NAME = 'service2';
const QUEUE_NAME = 'service2_queue';
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost:5672';

async function start() {
  const connection: ChannelModel = await connect(RABBITMQ_URL);
  const channel: Channel = await connection.createChannel();
  await channel.assertQueue(QUEUE_NAME, { durable: false });
  await channel.prefetch(1);

  // eslint-disable-next-line no-console
  console.log(`${SERVICE_NAME} listening on queue ${QUEUE_NAME}`);

  channel.consume(QUEUE_NAME, async (msg: ConsumeMessage | null) => {
    if (!msg) return;
    try {
      const payload = JSON.parse(msg.content.toString()) as {
        text?: string;
        sentAt?: string;
        user?: string;
        target?: string;
      };
      const receivedAt = new Date().toISOString();
      const text = payload.text ?? 'No text provided';
      const sentAt = payload.sentAt ?? 'unknown';
      const user = payload.user ?? 'unknown user';
      const target = payload.target ?? 'unknown target';

      const reply = `PONG from ${SERVICE_NAME} | target: ${target} | received: ${receivedAt} | sent: ${sentAt} | text: ${text} | user: ${user}`;

      if (msg.properties.replyTo) {
        channel.sendToQueue(
          msg.properties.replyTo,
          Buffer.from(JSON.stringify(reply)),
          { correlationId: msg.properties.correlationId },
        );
      }
      channel.ack(msg);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`${SERVICE_NAME} error handling message`, err);
      channel.nack(msg, false, false);
    }
  });
}

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(`Failed to start ${SERVICE_NAME}`, err);
  process.exit(1);
});
