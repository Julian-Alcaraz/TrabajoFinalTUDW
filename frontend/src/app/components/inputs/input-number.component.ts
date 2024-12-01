import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ErroresCampoComponent } from '../errores-campo/errores-camp.component';

@Component({
  selector: 'app-input-number',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ErroresCampoComponent],
  template: `
    <label [for]="idInput" class="block mb-2 text-sm font-medium text-gray-900">{{ label }}</label>
    <input [formControl]="control" type="number" [id]="idInput" [placeholder]="placeholder" (change)="handleChange($event)" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
    <div *ngIf="control?.errors && (control?.dirty || control?.touched)" class="text-red-600 text-sm">
      <app-errores-campo [errors]="control.errors" />
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
