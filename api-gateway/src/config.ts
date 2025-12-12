export const SERVICE_QUEUES = {
  service1: 'service1_queue',
  service2: 'service2_queue',
} as const;

export type ServiceName = keyof typeof SERVICE_QUEUES;

export const config = {
  port: Number(process.env.PORT) || 3000,
  jwtSecret: process.env.JWT_SECRET || 'dev-secret',
  rabbitmqUrl: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
  rpcTimeoutMs: Number(process.env.RPC_TIMEOUT_MS) || 5000,
};
