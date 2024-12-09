import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GLOBAL } from '@config/global';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CursoService {
  private url: string;
  constructor(private _http: HttpClient) {
    this.url = GLOBAL.URL_BACKEND;
  }

  modificarCurso(id: number, data: any): Observable<any> {
    return this._http.patch(this.url + 'curso/' + id, data);
  }
  // Obtiene los deshabilitados tambien
  obtenerTodosCursos() {
    return this._http.get(this.url + 'curso');
  }
  obtenerCursos() {
    return this._http.get(this.url + 'curso/habilitados');
  }
  cargarCurso(data: any): Observable<any> {
    return this._http.post(this.url + 'curso', data);
  }
}
