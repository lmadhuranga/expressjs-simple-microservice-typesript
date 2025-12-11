import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  replyToPing(data: { text?: string; sentAt?: string; user?: string }): string {
    const receivedAt = new Date().toISOString();
    const text = data.text ?? 'No text provided';
    const sentAt = data.sentAt ?? 'unknown';
    const user = data.user ?? 'unknown user';
    // Build a human-friendly response that app1 returns to the HTTP caller
    return `PONG from service1 | received: ${receivedAt} | sent: ${sentAt} | text: ${text} | user: ${user}`;
  }
}
