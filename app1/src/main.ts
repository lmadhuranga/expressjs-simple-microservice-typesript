import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`app1 HTTP server running on port ${port}`); // app1 only hosts HTTP to trigger RMQ calls
}
bootstrap();
