import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input-checkbox',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <div class="flex items-center">
      <input (change)="handleChange($event)" [formControl]="control" [id]="idInput" [placeholder]="placeholder" type="checkbox" class="m-2 rounded text-blue-600 focus:ring-blue-500 w-5 h-5 sm:w-4 sm:h-4" />
      <label [for]="idInput" class="text-sm font-medium text-gray-900">{{ label }}</label>
    </div>
    <div *ngIf="control?.errors && (control?.dirty || control?.touched)" class="text-red-600 text-sm">
      <div *ngIf="control?.errors?.['required']">Debe seleccionar una opción.</div>
    </div>
  `,
})
export class InputCheckboxComponent {
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
