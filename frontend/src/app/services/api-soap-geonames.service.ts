import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GLOBAL } from './global';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiSoapGeoNamesService {
  private url: string;
  constructor(private _http: HttpClient) {
    this.url = GLOBAL.URL_BACKEND;
  }

  buscarProvinciasxPais(data: any): Observable<any> {
    const params = { pais: data };
    return this._http.post(this.url + 'api-soap/provinces', params);
  }
}


