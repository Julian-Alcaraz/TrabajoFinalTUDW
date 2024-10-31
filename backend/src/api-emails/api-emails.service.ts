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

  // Validar email pago
  async validarEmail(email: string): Promise<any> {
    const apiKey = this.configService.getOrThrow('API_EMAILS_PAGO');
    const url = `https://api.zerobounce.net/v2/validate?api_key=${apiKey}&email=${email}`;
    // PRUEBAS:
    // return { error: 'Invalid API Key or your account ran out of credits' }; // RESPUESTA DE ERROR
    // return { status: 'valid' }; // RESPUESTA EMAIL VALIDO
    // return { status: 'invalid' }; // RESPUESTA EMAIL INVALIDO

    // FUNCIONANDO:

    // try {
    //   const response = await lastValueFrom(this.httpService.get(url));
    //   console.log('RESPONSE API EMAILS PAGO:');
    //   console.log(response.data);
    //   return response.data;
    // } catch (error) {
    //   throw new Error(`Error al validar el mail: ${error.message}`);
    // }
  }

  /*
  // Validar email gratis
  async validarEmailGratis(email: string) {
    const data = {
      api_key: this.configService.getOrThrow('API_EMAILS_GRATIS'),
      email_address: email,
    };
    const url = 'https://verify.maileroo.net/check';
    try {
      const response = await lastValueFrom(
        this.httpService.post(url, data, {
          headers: {
            'Content-Type': 'application/json',
          },
        }),
      );
      console.log('RESPONSE API EMAILS GRATIS:', response.data);
      return response.data;
    } catch (error) {
      throw new Error(`Error al validar el mail: ${error.message}`);
    }
  }
  */
}
