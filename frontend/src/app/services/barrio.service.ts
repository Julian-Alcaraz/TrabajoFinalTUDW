import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GLOBAL } from '@config/global';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BarrioService {
  private url: string;
  constructor(private _http: HttpClient) {
    this.url = GLOBAL.URL_BACKEND;
  }

  cargarBarrio(data: any): Observable<any> {
    return this._http.post(this.url + 'barrio', data);
  }
  obtenerBarrios() {
    return this._http.get(this.url + 'barrio/habilitados');
  }
  obtenerTodosBarrios() {
    return this._http.get(this.url + 'barrio');
  }
  modificarBarrio(id: number, data: any): Observable<any> {
    return this._http.patch(this.url + 'barrio/' + id, data);
  }
}
