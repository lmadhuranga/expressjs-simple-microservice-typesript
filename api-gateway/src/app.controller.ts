import {
  Controller,
  Get,
  Param,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(JwtAuthGuard)
  @Get('ping/:service')
  async pingService(
    @Param('service') service: 'service1' | 'service2' | 'service3' | 'service4' | 'service5',
    @Query('message') message?: string,
    @Request() req?: { user?: { username?: string } },
  ): Promise<string> {
    // eslint-disable-next-line no-console
    console.log(`api-gateway endpoint hit: GET /ping/${service}`);
    return this.appService.pingService(service, message, req?.user?.username);
  }

  @UseGuards(JwtAuthGuard)
  @Get('ping-all')
  async pingAll(
    @Query('message') message?: string,
    @Request() req?: { user?: { username?: string } },
  ): Promise<string[]> {
    // eslint-disable-next-line no-console
    console.log('api-gateway endpoint hit: GET /ping-all');
    return this.appService.pingAll(message, req?.user?.username);
  }
}
