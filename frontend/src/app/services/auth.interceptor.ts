import { HttpErrorResponse, HttpHeaders, HttpInterceptorFn } from '@angular/common/http';
import { SessionService } from './session.service';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { getCookie } from './cookies';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // obtener token y agregarlo a la consulta authenticator para proteccion

  const _sessionService = inject(SessionService);

  const cookieValue = getCookie('Authorization');
  const token = cookieValue ? cookieValue : '';
  let headers = new HttpHeaders();
  if (req.method === 'POST') {
    if (!(req.body instanceof FormData)) {
      headers = headers.set('Content-Type', 'application/json');
    }
  }
  headers = headers.set('authorization', token);

  const authReq = req.clone({
    headers: headers,
    withCredentials: true,
  });

  return next(authReq).pipe(
    catchError((err: any) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401 || err.status === 403) {
          _sessionService.cerrarSesion();
          // no se puede hacr por como esta planteado el sistema, redirigir a SSO
          // lugar para hacer un refresh token
        }
      } else {
        // Handle non-HTTP errors
        // console.error('An error occurred:', err);
      }
      return throwError(() => err);
    }),
  );
};
