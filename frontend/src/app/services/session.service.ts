import { Injectable } from '@angular/core';
import { GLOBAL } from '@config/global';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '@models/usuario.model';
import { LoadingService } from './loading.service';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private url: string;
  private identidad: Usuario | null;

  constructor(
    private _http: HttpClient,
    private _router: Router,
    private _loadingService: LoadingService,
    private _dialog: MatDialog,
  ) {
    this.url = GLOBAL.URL_BACKEND;
    this.identidad = null;
  }

  iniciarSession(email: string, password: string): Observable<any> {
    return this._http.post(this.url + 'auth/login', { email, contrasenia: password }, { withCredentials: true });
  }

  // eliminar la cookie
  cerrarSesion() {
    this.eliminarCookie().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.setIdentidad(null);
          if (this.identidad != null) {
            this._loadingService.startLoading();
          }
          this._router.navigate(['/login']);
          this._dialog.closeAll();
        } else {
          console.log('Fallo cerrar la sesion', response.message);
        }
      },
      error: (err) => {
        console.log('Fallo cerrar la sesion', err);
      },
    });
  }

  setIdentidad(usuario: Usuario | null) {
    this.identidad = usuario;
  }

  getIdentidad() {
    return this.identidad;
  }
  eliminarCookie(): Observable<any> {
    return this._http.post(this.url + 'auth/logout', null, { withCredentials: true });
  }

  estaLogueado(): Promise<boolean> {
    return new Promise((resolve) => {
      this._http.get(this.url + 'auth/status').subscribe({
        next: (res: any) => {
          if (res.success) {
            this.setIdentidad(res.user);
            resolve(true);
          } else {
            resolve(false);
          }
        },
        error: () => {
          this._loadingService.stopLoading();
          resolve(false);
        },
      });
    });
  }
}
