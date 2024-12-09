import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GLOBAL } from '@config/global';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CsvService {
  private url: string;

  constructor(private _http: HttpClient) {
    this.url = GLOBAL.URL_BACKEND;
  }
  generarCsv(data: any): Observable<any> {
    return this._http.post(this.url + 'csv', data);
  }
  descargarCsv(nombreArchivo: string) {
    return this._http.get(this.url + `csv/${nombreArchivo}`, { responseType: 'blob' });
  }
}
