import { Injectable } from '@angular/core';
import { GLOBAL } from './global';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class SessionService {

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
    return this._http.post(this.url + 'auth/login', { email, contrasenia: password }, { withCredentials: true });
  }

  // eliminar la cookie
  cerrarSesion() {
    this.eliminarCookie().subscribe({
      next: (response:any)=>{
        if(response.succes){
          this._router.navigate(['/login']);
        }else{
          console.log("Fallo cerrar la sesion",response.message)
        }
      },
      error: (err)=>{
        console.log("Fallo cerrar la sesion",err)
      }
    })
  }

  setIdentidad(usuario: Usuario) {
    console.log('SET IDENDTIAD SESSION SERVICE', this.identidad, usuario);
    this.identidad = usuario;
  }

  getIdentidad() {
    return this.identidad;
  }

  eliminarCookie():Observable<any>{
    return this._http.post(this.url+'auth/logout',null,{withCredentials:true})
  }

  estaLogueado():Promise<boolean>{
    return new Promise((resolve) => {
      this._http.get(this.url + '/session/validarToken').subscribe({
        next: (res: any) => {
          if (res.success) {
            resolve(true);
          } else {
            resolve(false);
          }
        },
        error: (error: any) => {
          console.log(error)
          resolve(false);
        }
      });
    });
  }
}
