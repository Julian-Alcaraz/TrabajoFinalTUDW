import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ApiEmailsService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async validarEmail(email: string) {
    const apiKey = this.configService.getOrThrow('API_EMAILS');
    const url = `https://api.zerobounce.net/v2/validate?api_key=${apiKey}&email=${email}`;
    // PRUEBAS:
    return { status: 'invalid' };

    // FUNCIONANDO:
        // try {
        //   const response = await lastValueFrom(this.httpService.get(url));
        //   console.log('RESPONSE API EMAILS:');
        //   console.log(response.data);
        //   return response.data;
        // } catch (error) {
        //   throw new Error(`Error al validar el mail: ${error.message}`);
        // }
  }
}
