import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, InternalServerErrorException, RequestTimeoutException } from '@nestjs/common';
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
    // const url = `https://pi.zerobounce.net/v2/validate?api_key=${apiKey}&email=${email}`; // error not found
    const url = `https://api.zerobounce.net/v2/validate?api_key=${apiKey}&email=${email}`;
    // FUNCIONANDO:
    try {
      const response = await lastValueFrom(this.httpService.get(url, { timeout: 1500 })); // timeout en 1 para error
      return response.data;
    } catch (error) {
      if (error.code === 'ENOTFOUND') {
        throw new InternalServerErrorException('Error de conexión con el servidor externo.');
      }
      if (error.code === 'ECONNABORTED') {
        throw new RequestTimeoutException('La solicitud al servidor externo tomó demasiado tiempo y fue cancelada. <br> Intentelo nuevamente mas tarde.');
      } else if (error.response) {
        const statusCode = error.response.status;
        if (statusCode >= 400 && statusCode < 500) {
          // params o apikeys
          throw new BadRequestException(`Error en la solicitud. Verifica los datos.`);
        } else if (statusCode >= 500) {
          throw new InternalServerErrorException(`Error en el servidor externo. <br> Intentelo nuevamente mas tarde.`);
        }
      } else if (error.request) {
        throw new InternalServerErrorException('Error de conexión con el servidor externo.');
      } else {
        throw new InternalServerErrorException(`Error inesperado.`);
      }
    }
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
