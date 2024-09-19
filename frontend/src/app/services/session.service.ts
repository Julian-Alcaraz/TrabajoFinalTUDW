import { Injectable } from '@angular/core';
import { GLOBAL } from './global';
import { HttpClient } from '@angular/common/http';
import { delay, Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  //constructor() {}
  private url: string;
  private identidad: Usuario | null;

  constructor(
    private _http: HttpClient,
    private _router: Router,
  ) {
    this.url = GLOBAL.URL_BACKEND;
    this.identidad = null;
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
  cerrarSesion() {
    localStorage.removeItem('isLogged');
    this._router.navigate(['/login']);
  }
  setIdentidad(usuario: Usuario) {
    // console.log("SET IDENDTIAD SESSION SERVICE",this.identidad, usuario)
    this.identidad = usuario;
  }
  getIdentidad() {
    // console.log("get IDENDTIAD SESSION SERVICE",this.identidad)
    return this.identidad;
  }
}
