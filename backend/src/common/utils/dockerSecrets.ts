import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';

const configService = new ConfigService();

export function readSecret(secret: string) {
  try {
    return fs.readFileSync(`/run/secrets/${secret}`, 'utf8').trim();
  } catch {
    return configService.getOrThrow<any>(secret);
  }
};