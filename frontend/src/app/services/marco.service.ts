import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GLOBAL } from '@config/global';
// import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MarcoService {
  private url: string;
  constructor(private _http: HttpClient) {
    this.url = GLOBAL.URL_BACKEND;
  }

  obtenerMarcos() {
    return this._http.get(this.url + 'marco');
  }
}
