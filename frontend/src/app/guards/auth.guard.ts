import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { SessionService } from '../services/session.service';
export const authGuard: CanActivateFn = async (route, state) => {
  const _router = inject(Router);
  const _sessionService = inject(SessionService);
  let isLoged;
  if (_sessionService.getIdentidad() == null) {
    isLoged = await _sessionService.estaLogueado();
  } else {
    isLoged = true;
  }
  if (isLoged) {
    if (state.url == '/login') {
      return _router.navigate(['/layout']);
    } else {
      return true;
    }
  } else {
    if (state.url != '/login') {
      // _router.navigate(['/login'])
      return true;
    } else {
      return false;
    }
  }
};

export const adminGuard: CanActivateFn = () => {
  const _sessionService = inject(SessionService);
  const identidad = _sessionService.getIdentidad();
  if (identidad) {
    if (identidad.roles_ids?.includes(1)) {
      return true;
    }
    return false;
  } else {
    return false;
  }
};
