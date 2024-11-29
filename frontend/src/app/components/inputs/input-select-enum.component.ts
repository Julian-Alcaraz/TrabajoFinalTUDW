import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input-select-enum',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <label [for]="idInput" class="block mb-4 text-sm font-medium text-gray-900">{{ label }}</label>
    <select [formControl]="control" [id]="idInput" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
      <option [value]="''" disabled selected>{{ placeholder }}</option>
      <option *ngFor="let opcion of opciones; let i = index" [value]="valores[i] || opcion">{{ opcion }}</option>
    </select>
    <div *ngIf="control?.errors && (control?.dirty || control?.touched)" class="text-red-600 text-sm">
      <div *ngIf="control?.errors?.['required']">Debe seleccionar una opción.</div>
    </div>
  `,
})
export class InputSelectEnumComponent {
  @Input() label!: string;
  @Input() control!: FormControl;
  @Input() placeholder = 'Selecciona una opción';
  @Input() opciones: string[] = [];
  @Input() valores: string[] = [];
  @Input() idInput = '';
}
