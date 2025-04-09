import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GLOBAL } from '@config/global';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private url: string;
  constructor(private _http: HttpClient) {
    this.url = GLOBAL.URL_BACKEND;
  }
  traerUsuarioMenu(idUsuario: number) {
    return this._http.get(this.url + 'usuario/menus/' + idUsuario);
  }
}
