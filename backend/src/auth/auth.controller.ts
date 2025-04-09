import { Controller, Post, UseGuards, Req, Res, Get } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

import { LocalGuard } from './guards/local.guard';
import { JwtAuthGuard } from './guards/jwt.guard';
import { SecretService } from 'src/common/services/secret.service';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly secretService: SecretService) {}

  /**
   * Cuando hago una peticion post a "login" primero se invoca a el LocalGuard,
   * ejecuta el metodo canActivate() y este ejecuta el super.CanActivate() que va a local.strategy
   */
  @Post('login')
  @UseGuards(LocalGuard) // Guard incluido en nestjs passport, le paso el nombre de la strategy y la invoca
  login(@Req() req: Request, @Res() res: Response) {
    const { token, usuario } = req.user as any;
    // Guardo token en cookie
    res.cookie('Authorization', token, {
      maxAge: 24 * 60 * 60 * 1000, // 24 horas
      sameSite: this.secretService.readSecret('COOKIE_SAME_SITE'),
      httpOnly: this.secretService.readSecret('COOKIE_HTTP_ONLY') === 'true',
      secure: this.secretService.readSecret('COOKIE_SECURE') === 'true',
    });
    let response;
    if (usuario) response = { success: true, data: usuario, message: 'Inicio de sesion correcto' };
    else response = { success: false, message: 'Inicio de sesion incorrecto' };
    return res.status(200).send(response);
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  status(@Res() res: Response, @Req() req: Request) {
    return res.status(200).send({ success: true, user: req.user });
  }

  @Post('logout')
  logout(@Res() res: Response) {
    // Elimina cookie de token
    res.clearCookie('Authorization', {
      sameSite: this.secretService.readSecret('COOKIE_SAME_SITE'),
      httpOnly: this.secretService.readSecret('COOKIE_HTTP_ONLY') === 'true',
      secure: this.secretService.readSecret('COOKIE_SECURE') === 'true',
    });
    return res.status(200).send({ success: true, message: 'Logout exitoso' });
  }
}
