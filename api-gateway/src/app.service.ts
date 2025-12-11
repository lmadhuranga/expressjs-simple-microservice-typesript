import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

type ServiceKey = 'service1' | 'service2' | 'service3' | 'service4' | 'service5';

@Injectable()
export class AppService implements OnModuleInit {
  private clients: Record<ServiceKey, ClientProxy>;

  constructor(
    @Inject('SERVICE1_CLIENT') private readonly service1Client: ClientProxy,
    @Inject('SERVICE2_CLIENT') private readonly service2Client: ClientProxy,
    @Inject('SERVICE3_CLIENT') private readonly service3Client: ClientProxy,
    @Inject('SERVICE4_CLIENT') private readonly service4Client: ClientProxy,
    @Inject('SERVICE5_CLIENT') private readonly service5Client: ClientProxy,
  ) {
    this.clients = {
      service1: this.service1Client,
      service2: this.service2Client,
      service3: this.service3Client,
      service4: this.service4Client,
      service5: this.service5Client,
    };
  }

  async onModuleInit(): Promise<void> {
    // Connect all RMQ clients up front
    await Promise.all(
      Object.values(this.clients).map((client) => client.connect()),
    );
  }

  async pingService(
    service: ServiceKey,
    message?: string,
    username?: string,
  ): Promise<string> {
    const client = this.clients[service];
    const payload = {
      text: message ?? `Hello from api-gateway to ${service}`,
      sentAt: new Date().toISOString(),
      user: username ?? 'anonymous',
      target: service,
    };

    const response$ = client.send<string>('ping', payload);
    return firstValueFrom(response$);
  }

  async pingAll(message?: string, username?: string): Promise<string[]> {
    const services: ServiceKey[] = [
      'service1',
      'service2',
      'service3',
      'service4',
      'service5',
    ];

    const results = [];
    for (const svc of services) {
      const res = await this.pingService(svc, message, username);
      results.push(res);
    }
    return results;
  }
}
