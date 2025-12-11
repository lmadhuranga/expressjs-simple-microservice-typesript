import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(JwtAuthGuard)
  @Get('ping1')
  async pingApp2(
    @Query('message') message?: string,
    @Request() req?: { user?: { username?: string } },
  ): Promise<string> {
    // eslint-disable-next-line no-console
    console.log('app1 endpoint hit: GET /ping');
    // Forward message to app2 via RMQ and return its reply
    return this.appService.pingApp2(message, req?.user?.username);
  }
}
