import { randomUUID } from 'crypto';
import { Channel, ChannelModel, ConsumeMessage, connect } from 'amqplib';
import { config } from '../config';

type PendingMap = Map<string, (msg: ConsumeMessage) => void>;

export class RpcClient {
  private connection?: ChannelModel;

  private channel?: Channel;

  private replyQueue?: string;

  private pending: PendingMap = new Map();

  async init(): Promise<void> {
    this.connection = await connect(config.rabbitmqUrl);
    this.channel = await this.connection.createChannel();
    const { queue } = await this.channel.assertQueue('', { exclusive: true });
    this.replyQueue = queue;

    await this.channel.consume(
      this.replyQueue,
      (msg: ConsumeMessage | null) => {
        if (!msg) return;
        const handler = this.pending.get(msg.properties.correlationId || '');
        if (handler) {
          handler(msg);
        }
      },
      { noAck: true },
    );
  }

  async send<TPayload, TResult>(queue: string, payload: TPayload): Promise<TResult> {
    if (!this.channel || !this.replyQueue) {
      throw new Error('RPC channel not initialized');
    }

    const correlationId = randomUUID();

    return new Promise<TResult>((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(correlationId);
        reject(new Error(`RPC timeout to ${queue}`));
      }, config.rpcTimeoutMs);

      this.pending.set(correlationId, (msg) => {
        clearTimeout(timer);
        this.pending.delete(correlationId);
        try {
          const parsed = JSON.parse(msg.content.toString()) as TResult;
          resolve(parsed);
        } catch (err) {
          reject(err);
        }
      });

      this.channel?.sendToQueue(queue, Buffer.from(JSON.stringify(payload)), {
        replyTo: this.replyQueue,
        correlationId,
      });
    });
  }

  async close(): Promise<void> {
    if (this.channel) {
      await this.channel.close();
    }
    if (this.connection) {
      await this.connection.close();
    }
  }
}
