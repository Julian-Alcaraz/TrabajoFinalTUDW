import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GLOBAL } from './global';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private url: string;
  constructor(private _http: HttpClient) {
    this.url = GLOBAL.URL_BACKEND;
  }
  traerUsuarioMenu(idUsuario: number) {
    console.log('ID USUARIO SERVICE MENU', idUsuario);
    console.log('EJECUTAR' + this.url + '/menu/' + idUsuario);
    return this._http.get(this.url + 'menu/menusUsuario/' + idUsuario);
  }
}
