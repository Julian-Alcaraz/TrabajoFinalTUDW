import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input-text',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <label [for]="idInput" class="block mb-4 text-sm font-medium text-gray-900"
      >{{ label }} <small class="text-gray-500">{{ opcional ? '(Opcional)' : '' }}</small></label
    >
    <input [formControl]="control" type="text" [id]="idInput" [placeholder]="placeholder" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
    <div *ngIf="control?.errors && (control?.dirty || control?.touched)" class="text-red-600 text-sm">
      <div *ngIf="control?.errors?.['required']">El campo es requerido.</div>
      <div *ngIf="control?.errors?.['minlength']">Mínimo {{ control.errors?.['minlength']?.requiredLength }} caracteres.</div>
      <div *ngIf="control?.errors?.['maxlength']">Máximo {{ control.errors?.['maxlength']?.requiredLength }} caracteres.</div>
      <div *ngIf="control?.errors?.['ValidarSoloLetras']">Solo puede tener letras.</div>
      <div *ngIf="control?.errors?.['ValidarCadenaSinEspacios']">El campo no puede estar en blanco.</div>
      <div *ngIf="control?.errors?.['ValidarHora']">La hora debe estar en formato HH:mm. La hora debe ser valida(pasar esto a otro mensaje de error)</div>
    </div>
  `,
})
export class InputTextComponent {
  @Input() label!: string;
  @Input() control!: FormControl;
  @Input() placeholder = '';
  @Input() idInput = '';
  @Input() opcional = false;
}
