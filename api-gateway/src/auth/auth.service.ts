import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  // In a real app, validate user credentials from a DB
  validateUser(username: string, password: string): boolean {
    return username === 'demo' && password === 'demo';
  }

  issueToken(username: string): string {
    const payload = { sub: username, username };
    return this.jwtService.sign(payload);
  }
}
