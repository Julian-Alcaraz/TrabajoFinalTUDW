import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
// import { getCookie } from '../services/cookies';
import { CookieService } from 'ngx-cookie-service';
export const authGuard: CanActivateFn = (route, state) => {
  // validar si el usuario esta logueado y redireccionar al componente que corresponda.
  // console.log(route, state);
  // const isLogged = true ;
  const _router = inject(Router);
  const _cookieService = inject(CookieService);
  // if (typeof window === 'undefined') {
  //   // En el servidor, simplemente permitimos la navegación
  //   return false;
  // }
  // Aquí puedes usar el router para navegar o realizar otras operaciones
  const isLogged = _cookieService.get('Authorization');
  console.log('IS LOGUED', isLogged);

  if (isLogged) {
    if (state.url == '/login') _router.navigate(['/layout']);
    return true;
  } else {
    if (state.url != '/login') _router.navigate(['/login']);
    return true;
  }
};
