import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    // Logica adicional ...
    return super.canActivate(context);
  }
  handleRequest(err, user, info) {
    if (err || !user) {
      if (info && info.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Sesión expirada. Ingresa nuevamente.');
      } else if (info && info.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Token no válido. Por favor, inicia sesión nuevamente.');
      } else if (!info) {
        console.log('err:', err);
        console.log('user:', user);
        console.log('info:', info);
        throw new UnauthorizedException('Por favor, inicie sesión.');
      } else {
        console.log('err:', err);
        console.log('user:', user);
        console.log('info:', info);
        throw new UnauthorizedException('Por favor, inicie sesión.');
      }
    }
    return user;
  }
}
