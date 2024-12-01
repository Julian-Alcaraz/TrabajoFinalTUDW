import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ErroresCampoComponent } from '../errores-campo/errores-camp.component';

@Component({
  selector: 'app-input-text',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ErroresCampoComponent],
  template: `
    <label [for]="idInput" class="block mb-4 text-sm font-medium text-gray-900"
      >{{ label }} <small class="text-gray-500">{{ opcional ? '(Opcional)' : '' }}</small></label
    >
    <input [formControl]="control" type="text" [id]="idInput" [placeholder]="placeholder" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
    <div *ngIf="control?.errors && (control?.dirty || control?.touched)" class="text-red-600 text-sm">
      <app-errores-campo [errors]="control.errors" />
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
