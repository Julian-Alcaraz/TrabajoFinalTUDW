import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
// import { getCookie } from '../services/cookies';
import { CookieService } from 'ngx-cookie-service';
// import { SessionService } from '../services/session.service';
export const authGuard: CanActivateFn = (route, state) => {
  // validar si el usuario esta logueado y redireccionar al componente que corresponda.
  console.log("guard")
  const _router = inject(Router);

  const _cookieService = inject(CookieService);
  // Aquí puedes usar el router para navegar o realizar otras operaciones
  const token = _cookieService.get('Authorization');
console.log(token)
  if (token) {
    if(state.url == '/login'){
      return  _router.navigate(['/layout'])
      return false
      return _router.parseUrl('/layout');
    }else{
      return true
    }
  } else{
    console.log(state)
    if(state.url != '/login'){
      // _router.navigate(['/login'])

      return true;
    }else{
      return true
    }
  }


  /* cuando este el back
  const _sessionService = inject(SessionService)

  return new Promise<boolean>((resolve, reject) => {
    _sessionService.estaLogueado().then(estaLogueado => {
      if (estaLogueado) {
        _router.navigate(['/layout']);
        resolve(true);
      } else {
        resolve(false);
   //   if (state.url != '/login') _router.navigate(['/login']);

      }
    }).catch(error => {
      reject(error);
    });
  });*/






  /* cuando este el back
  const _sessionService = inject(SessionService)

  return new Promise<boolean>((resolve, reject) => {
    _sessionService.estaLogueado().then(estaLogueado => {
      if (estaLogueado) {
        _router.navigate(['/layout']);
        resolve(false);
      } else {
        resolve(false);
   //   if (state.url != '/login') _router.navigate(['/login']);

      }
    }).catch(error => {
      reject(error);
    });
  });*/




};
