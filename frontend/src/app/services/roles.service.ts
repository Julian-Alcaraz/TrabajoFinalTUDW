import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GLOBAL } from '../config/global';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  private url: string;
  constructor(private _http: HttpClient) {
    this.url = GLOBAL.URL_BACKEND;
  }
  obtenerRoles() {
    return this._http.get(this.url + 'rol');
  }
}
