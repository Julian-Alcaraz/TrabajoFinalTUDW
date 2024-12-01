import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ErroresCampoComponent } from '../errores-campo/errores-camp.component';

@Component({
  selector: 'app-input-textarea',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ErroresCampoComponent],
  template: `
    <label [for]="idInput" class="block mb-4 text-sm font-medium text-gray-900"
      >{{ label }} <small class="text-gray-500">{{ opcional ? '(Opcional)' : '' }}</small></label
    >
    <textarea [id]="idInput" [formControl]="control" [placeholder]="placeholder" rows="4" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"> </textarea>
    <div *ngIf="control?.errors && (control?.dirty || control?.touched)" class="text-red-600 text-sm">
      <app-errores-campo [errors]="control.errors" />
    </div>
  `,
})
export class InputTextareaComponent {
  @Input() label!: string;
  @Input() control!: FormControl;
  @Input() placeholder = '';
  @Input() idInput = '';
  @Input() opcional = false;
}
