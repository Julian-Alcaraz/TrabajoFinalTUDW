// import { CommonModule } from '@angular/common';
// import { Component, Input } from '@angular/core';

// @Component({
//   selector: 'app-errores-campo',
//   imports: [CommonModule],
//   standalone: true,
//   template: `
//   {{errors | json}}
//   {{errors.length}}
//     <div *ngIf="errors?.['required']">Campo requerido.</div>
//     <div *ngIf="errors?.['maxlength']">Máximo {{ errors?.['maxlength'].requiredLength }} caracteres.</div>
//     <div *ngIf="errors?.['minlength']">Mínimo {{ errors?.['minlength'].requiredLength }} caracteres.</div>
//     <div *ngIf="errors?.['min']">Valor mínimo: {{ errors?.['min'].min }}.</div>
//     <div *ngIf="errors?.['max']">Valor máximo: {{ errors?.['max'].max }}.</div>
//     <div *ngIf="errors?.['email']">Correo electrónico inválido.</div>
//     <div *ngIf="errors?.['pattern']">{{ obtenerMensajePatron(errors?.['pattern']) }}</div>
//     <!-- Personalizados -->
//     <div *ngIf="errors?.['ValidarSoloLetras']">Solo puede tener letras.</div>
//     <div *ngIf="errors?.['ValidarCadenaSinEspacios']">El campo no puede estar en blanco.</div>
//     <div *ngIf="errors?.['ValidarHora']">La hora debe estar en formato HH:mm. La hora debe ser valida(pasar esto a otro mensaje de error)</div>
//     <div *ngIf="errors?.['ValidarDni']">Debe tener 8 dígitos.</div>
//   `,
// })
// export class ErroresCampoComponent {
//   @Input() errors: any = {};

//   obtenerMensajePatron(error: any): string {
//     if (error.requiredPattern === '^[a-zA-Z]+$') {
//       return 'Solo se permiten letras.';
//     }
//     if (error.requiredPattern === '^[0-9]+$') {
//       return 'Solo se permiten números.';
//     }
//     return 'Formato inválido.';
//   }
// }
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-errores-campo',
  imports: [CommonModule],
  standalone: true,
  template: `
    <div *ngIf="primerError">
      {{ obtenerMensajeError(primerError[0], primerError[1]) }}
    </div>
  `,
})
export class ErroresCampoComponent {
  @Input() errors: any = {};

  get primerError(): [string, any] | null {
    return this.errors ? (Object.entries(this.errors)[0] as [string, any]) : null;
  }

  obtenerMensajeError(tipoError: string, error: any): string {
    const mensajesError: Record<string, string> = {
      required: 'Campo requerido.',
      maxlength: `Máximo ${error?.requiredLength} caracteres.`,
      minlength: `Mínimo ${error?.requiredLength} caracteres.`,
      min: `Valor mínimo: ${error?.min}.`,
      max: `Valor máximo: ${error?.max}.`,
      email: 'Correo electrónico inválido.',
      pattern: this.obtenerMensajePatron(error),
      ValidarSoloLetras: 'Solo puede tener letras.',
      ValidarCadenaSinEspacios: 'El campo no puede estar en blanco.',
      ValidarHora: 'La hora debe estar en formato HH:mm.',
      ValidarDni: 'Debe tener 8 dígitos.',
    };

    return mensajesError[tipoError] || 'Error desconocido';
  }

  obtenerMensajePatron(error: any): string {
    if (error?.requiredPattern === '^[a-zA-Z]+$') {
      return 'Solo se permiten letras.';
    }
    if (error?.requiredPattern === '^[0-9]+$') {
      return 'Solo se permiten números.';
    }
    return 'Formato inválido.';
  }
}
