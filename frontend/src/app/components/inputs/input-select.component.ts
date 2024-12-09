import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input-select',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <label [for]="idInput" class="block mb-2 text-sm font-medium text-gray-900">{{ label }}</label>
    <select (change)="handleChange($event)" [formControl]="control" [id]="idInput" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
      <option value="" disabled selected>{{ placeholder }}</option>
      <option *ngFor="let opcion of opciones" [value]="opcion.id">{{ opcion.nombre }}</option>
    </select>
    <div *ngIf="control?.errors && (control?.dirty || control?.touched)" class="text-red-600 text-sm">
      <div *ngIf="control?.errors?.['required']">Debe seleccionar una opción.</div>
    </div>
  `,
})
export class InputSelectComponent {
  @Input() label!: string;
  @Input() control!: FormControl;
  @Input() placeholder = 'Selecciona una opción';
  @Input() opciones: { id: any; nombre: string }[] = [];
  @Input() idInput = '';

  @Output() cambio = new EventEmitter<any>();

  handleChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.cambio.emit(value);
  }
}
