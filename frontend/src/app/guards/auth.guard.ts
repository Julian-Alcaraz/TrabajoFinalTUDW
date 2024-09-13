import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  // validar si el usuario esta logueado y redireccionar al componente que corresponda.
  console.log(route, state);
  const isLogged = true;
  const _router = inject(Router);
  // Aquí puedes usar el router para navegar o realizar otras operaciones

  if (isLogged) {
    if (state.url == '/login') _router.navigate(['/layout']);
    return true;
  } else {
    if (state.url != '/login') _router.navigate(['/login']);
    return true;
  }
};
