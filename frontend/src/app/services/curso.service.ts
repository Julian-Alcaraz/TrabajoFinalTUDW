import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GLOBAL } from './global';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CursoService {
  private url: string;
  constructor(private _http: HttpClient) {
    this.url = GLOBAL.URL_BACKEND;
  }

  obtenerCursos() {
    return this._http.get(this.url + 'curso');
  }

  cargarCurso(data: any): Observable<any> {
    return this._http.post(this.url + 'curso' , data);
  }
}

