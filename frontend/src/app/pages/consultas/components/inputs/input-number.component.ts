import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input-number',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <label [for]="idInput" class="block mb-4 text-sm font-medium text-gray-900">{{ label }}</label>
    <input [formControl]="control" type="number" [id]="idInput" [placeholder]="placeholder" (change)="handleChange($event)" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
    <div *ngIf="control?.errors && (control?.dirty || control?.touched)" class="text-red-600 text-sm">
      <div *ngIf="control?.errors?.['required']">El campo es requerido.</div>
      <div *ngIf="control?.errors?.['ValidarSoloNumeros']">Solo puede tener números.</div>
      <div *ngIf="control?.errors?.['ValidarNumerosFloat']">Solo se permiten números positivos.</div>
      <div *ngIf="control?.errors?.['minlength']">Mínimo {{ control.errors?.['minlength']?.requiredLength }} caracteres.</div>
      <div *ngIf="control?.errors?.['maxlength']">Máximo {{ control.errors?.['maxlength']?.requiredLength }} caracteres.</div>
      <div *ngIf="control?.errors?.['ValidarDni']">Debe tener 8 dígitos.</div>
    </div>
  `,
})
export class InputNumberComponent {
  @Input() label!: string;
  @Input() control!: FormControl;
  @Input() placeholder = '';
  @Input() idInput = '';

  @Output() cambio = new EventEmitter<any>();

  handleChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.cambio.emit(value);
  }
}
