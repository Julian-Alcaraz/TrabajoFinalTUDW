import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-input-date',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatDatepickerModule, MatFormFieldModule, MatInputModule],
  template: `
    <p class="block mb-2 text-sm font-medium text-gray-900">{{ label }}</p>
    <mat-form-field class="col-span-2">
      <mat-label>{{ label }}</mat-label>
      <input matInput [matDatepicker]="picker" [formControl]="control" [max]="max" [min]="min" />
      <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
      <mat-datepicker #picker></mat-datepicker>
    </mat-form-field>
    <div *ngIf="control?.errors && (control?.dirty || control?.touched)" class="text-red-600 text-sm">
      <div *ngIf="control?.errors?.['required']">Debe seleccionar una opción.</div>
    </div>
  `,
})
export class InputDateComponent {
  @Input() label!: string;
  @Input() control!: FormControl;
  @Input() min!: Date;
  @Input() max!: Date;
}
