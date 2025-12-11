import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('ping1')
  async pingApp2(@Query('message') message?: string): Promise<string> {
    // eslint-disable-next-line no-console
    console.log('app1 endpoint hit: GET /ping');
    // Forward message to app2 via RMQ and return its reply
    return this.appService.pingApp2(message);
  }
}
