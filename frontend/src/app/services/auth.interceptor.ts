import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // obtener token y agregarlo a la consulta authenticator para proteccion
  return next(req);
};
