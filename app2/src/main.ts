import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const url = process.env.RABBITMQ_URL ?? 'amqp://localhost:5672';
  const queue = 'app2_queue';

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [url],
        queue, // queue app1 sends to
        queueOptions: {
          durable: false,
        },
      },
    },
  );

  await app.listen();
  // eslint-disable-next-line no-console
  console.log(`app2 microservice listening via RMQ | queue: ${queue} | url: ${url}`);
}
bootstrap();
