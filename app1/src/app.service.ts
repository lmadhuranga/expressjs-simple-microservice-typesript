import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    @Inject('APP2_SERVICE')
    private readonly app2Client: ClientProxy,
  ) {}

  async onModuleInit(): Promise<void> {
    // Establish RMQ connection at startup so requests don't block later
    await this.app2Client.connect();
  }

  async pingApp2(message?: string): Promise<string> {
    const payload = {
      text: message ?? 'Hello from app1',
      sentAt: new Date().toISOString(),
    };

    // Send an RPC-style message to app2 and await the response
    const response$ = this.app2Client.send<string>('ping2', payload);
    return firstValueFrom(response$);
  }
}
