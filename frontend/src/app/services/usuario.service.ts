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

  cargarUsuario(data: any): Observable<any> {
    console.log(data);
    return this._http.post(this.url + 'usuario', data);
  }
}
