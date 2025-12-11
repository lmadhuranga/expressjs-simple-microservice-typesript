import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  replyToPing(data: { text?: string; sentAt?: string }): string {
    const receivedAt = new Date().toISOString();
    const text = data.text ?? 'No text provided';
    const sentAt = data.sentAt ?? 'unknown';
    // Build a human-friendly response that app1 returns to the HTTP caller
    return `PONG from app2 | received: ${receivedAt} | sent: ${sentAt} | text: ${text}`;
  }
}
