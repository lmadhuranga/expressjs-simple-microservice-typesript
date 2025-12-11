import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('ping')
  handlePing(@Payload() data: { text?: string; sentAt?: string }): string {
    // eslint-disable-next-line no-console
    console.log('service1 handler hit: MessagePattern "ping"');
    // Reply back to app1 with details about what we received
    return this.appService.replyToPing(data);
  }
}
