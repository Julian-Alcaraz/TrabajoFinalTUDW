import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';

@Injectable()
export class SecretService {
  constructor(private readonly configService: ConfigService) {}

  readSecret(secret: string) {
    try {
      return fs.readFileSync(`/run/secrets/${secret}`, 'utf8').trim();
    } catch {
      return this.configService.getOrThrow(secret);
    }
  }
}
