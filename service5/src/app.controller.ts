import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('ping')
  handlePing(@Payload() data: { text?: string; sentAt?: string; user?: string }) {
    // eslint-disable-next-line no-console
    console.log('service5 handler hit: MessagePattern "ping"');
    return this.appService.replyToPing(data);
  }
}
