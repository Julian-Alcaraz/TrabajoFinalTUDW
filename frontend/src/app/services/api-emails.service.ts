import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GLOBAL } from './global';

@Injectable({
  providedIn: 'root',
})
export class ApiEmailsService {
  private url: string;
  constructor(private _http: HttpClient) {
    this.url = GLOBAL.URL_BACKEND;
  }

  validarEmail(email: string) {
    return this._http.get(this.url + 'api-emails/'+email);
  }
}
