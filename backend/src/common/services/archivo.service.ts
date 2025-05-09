import { Readable } from 'stream';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ArchivoService {
  crearStream(buffer) {
    try {
      const readStream = Readable.from(buffer);
      return { success: true, stream: readStream };
    } catch (err) {
      return { success: false, err };
    }
  }
}
