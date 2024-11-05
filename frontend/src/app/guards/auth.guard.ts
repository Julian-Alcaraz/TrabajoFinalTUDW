import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { SessionService } from '../services/session.service';
import { CookieService } from 'ngx-cookie-service';
import { isPlatformBrowser } from '@angular/common';

export const authGuard: CanActivateFn = async (route, state) => {
  const platformId = inject(PLATFORM_ID);
  if (!isPlatformBrowser(platformId)) {
    return false;
  } else {
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
  }
};

export const adminGuard: CanActivateFn = () => {
  const platformId = inject(PLATFORM_ID);
  if (!isPlatformBrowser(platformId)) {
    return false;
  } else {
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
  }
};

export const loginGuard: CanActivateFn = () => {
  const platformId = inject(PLATFORM_ID);
  if (!isPlatformBrowser(platformId)) {
    return false;
  } else {
    const _cookieService = inject(CookieService);
    const token = _cookieService.get('Authorization');
    const _router = inject(Router);
    if (token) {
      _router.navigate(['/layout']);
      return false;
    } else {
      return true;
    }
  }
};
