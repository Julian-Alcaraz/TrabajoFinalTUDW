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
      throw new UnauthorizedException('Sesión expirada. Ingresa nuevamente.');
    }
    return user;
  }
}
