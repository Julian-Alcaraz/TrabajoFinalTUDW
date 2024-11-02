import { Controller, Get, Param } from '@nestjs/common';
import { ApiEmailsService } from './api-emails.service';

@Controller('api-emails')
export class ApiEmailsController {
  constructor(private readonly apiEmailsService: ApiEmailsService) {}

  @Get(':email')
  async validarEmail(@Param('email') email: string) {
    const response = await this.apiEmailsService.validarEmail(email);
    if (response.status !== 'valid') {
      return {
        success: false,
        data: response,
        message: 'Email no valido',
      };
    }
    return {
      success: true,
      data: response,
      message: 'Email validado con exito',
    };
  }
}
