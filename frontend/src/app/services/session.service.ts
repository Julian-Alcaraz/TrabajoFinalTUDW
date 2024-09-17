import { Injectable } from '@angular/core';
import { GLOBAL } from './global';
import { HttpClient } from '@angular/common/http';
import { delay, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  //constructor() {}
  private url: string;
  constructor(private _http: HttpClient) {
    this.url = GLOBAL.URL_BACKEND;
  }
  iniciarSession(email: string, password: string): Observable<any> {
    // por mientras
    const usuarios = {
      email: 'julianalcaraz4@gmail.com',
      password: '1234567',
    };
    let simulatedResponse;
    if (usuarios.email === email && usuarios.password === password) {
      simulatedResponse = {
        success: true,
        data: {
          id: 1,
          dni: 44671915,
          nombre: 'Julian',
          apellido: 'Alcaraz',
          email: 'julianalcarz4@gmail.com',
          especialidad: '',
          contrasenia: '',
          fechaNacimiento: '09/02/03',
          roles: [
            // esto es opcional podria  no estar
            { id: 1, descipcion: 'administradorr' },
            { id: 2, descipcion: 'medico' },
          ],
        },
        message: 'Ingreso exitosamente',
      };
    } else {
      simulatedResponse = {
        success: false,
        message: 'Datos incorrectos',
      };
    }
    return of(simulatedResponse).pipe(delay(1000));
    // cuando este el backend
    return this._http.get(this.url + '/sesion/iniciarSesion/' + email + '/' + password);
  }
}
