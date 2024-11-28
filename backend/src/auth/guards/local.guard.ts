import { ExecutionContext, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class LocalGuard extends AuthGuard('local') {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    // Logica adicional a parte de que coincidan email y contraseña
    return super.canActivate(context); // Esto invoca a local.strategy validate()
  }
  handleRequest(err, user, info) {
    if (err || !user) {
      if (err) {
        if (err.name == 'NotFoundException') throw new UnauthorizedException(err.message);
        if (err.name === 'UnauthorizedException') throw new UnauthorizedException(err.message);
        throw new UnauthorizedException('Error al iniciar sesión. Intentelo nuevamente.');
      }
      if (!user) throw new NotFoundException('Usuario no encontrado. Intentelo nuevamente.');
    }
    return user;
  }
}
