import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  replyToPing(data: { text?: string; sentAt?: string; user?: string }): string {
    const receivedAt = new Date().toISOString();
    const text = data.text ?? 'No text provided';
    const sentAt = data.sentAt ?? 'unknown';
    const user = data.user ?? 'unknown user';
    return `PONG from service2 | received: ${receivedAt} | sent: ${sentAt} | text: ${text} | user: ${user}`;
  }
}
