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
      ValidarSoloNumeros:'Este campo de',
      invalidDni: 'El documento esta en uso'
    };
    // elimino el mensaje por defecto: ese muestra en error de buscar dni 'Error desconocido'
    return mensajesError[tipoError] || '';
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
