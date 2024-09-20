import { Controller, Post, UseGuards, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from './guards/jwt.guard';
import { LocalGuard } from './guards/local.guard';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
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
      maxAge: 60 * 60 * 1000, // 1 hora
      httpOnly: false,
      secure: false,
    });
    let response;
    if (usuario) response = { success: true, data: usuario, message: 'Inicio de sesion correcto' };
    else response = { success: false, message: 'Inicio de sesion incorrecto' };
    return res.status(200).send(response);
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  status(@Req() req: Request) {
    return req.user;
  }

  @Post('logout')
  logout(@Res() res: Response) {
    // Elimina cookie de token
    res.clearCookie('Authorization', {
      httpOnly: false,
      secure: false,
    });
    return res.status(200).send({ success: true, message: 'Logout exitoso' });
  }
}
