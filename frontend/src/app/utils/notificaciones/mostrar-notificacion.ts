import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificacionComponent } from './notificacion.component';

function mensajeExito(snackBar: MatSnackBar, msj: string) {
  snackBar.openFromComponent(NotificacionComponent, {
    duration: 3000,
    data: [msj],
    panelClass: ['alert', 'alert-success'],
    verticalPosition: 'top',
  });
}

function mensajeAtencion(snackBar: MatSnackBar, msj: string) {
  snackBar.openFromComponent(NotificacionComponent, {
    duration: 7000,
    data: [msj],
    panelClass: ['alert', 'alert-info'],
    verticalPosition: 'top',
  });
}

function mensajeError(snackBar: MatSnackBar, err: string) {
  snackBar.openFromComponent(NotificacionComponent, {
    duration: 7000,
    data: [err],
    panelClass: ['alert', 'alert-danger'],
    verticalPosition: 'top',
  });
}

function mensajeErrorServicio(snackBar: MatSnackBar, error: any) {
  // console.log('[ERROR SERVICIO] ', error);
  const error_mje: any = error;

  if (error_mje != null) {
    let mensaje = '';
    if (error_mje.statusText === 'Unknown Error') {
      mensaje = 'Servidor desconectado. Comunicate con Desarrollo de Software.';
    } else {
      if (error_mje.error.message) {
        mensaje = error_mje.error.message;
      } else {
        mensaje = error_mje.error;
      }
    }

    mensajeError(snackBar, mensaje);
  }
}

export { mensajeError, mensajeExito, mensajeAtencion, mensajeErrorServicio };
