import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private url: string;

  constructor(
    private _http: HttpClient,
    // private _router: Router,
  ) {
    this.url = GLOBAL.URL_BACKEND;
  }

  obtenerProfesionales(): Observable<any> {
    return this._http.get(this.url + 'usuario/profesionales');
  }
  cargarUsuario(data: any): Observable<any> {
    return this._http.post(this.url + 'usuario', data);
  }
  modificarUsuario(id: number, data: any): Observable<any> {
    return this._http.patch(this.url + 'usuario/' + id, data);
  }
  obtenerUsuarioxId(id: number): Observable<any> {
    return this._http.get(this.url + 'usuario/' + id);
  }
  obtenerUsuarios(): Observable<any> {
    return this._http.get(this.url + 'usuario');
  }
  modificarContrasenia(id: number, data: any): Observable<any> {
    return this._http.patch(this.url + 'usuario/modificarContrasenia/' + id, data);
  }
}
