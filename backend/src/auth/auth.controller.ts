import { Controller, Post, UseGuards, Get, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LocalGuard } from './guards/local.guard';
import { Request, Response } from 'express';
import { JwtAuthGuard } from './guards/jwt.guard';

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
      secure: true,
      httpOnly: true,
      maxAge: 60 * 60 * 1000, // 1 hora
      // expires
    });
    return res.status(200).json(usuario);
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  status(@Req() req: Request) {
    return req.user;
  }
}
