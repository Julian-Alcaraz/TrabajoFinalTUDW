import { MatRadioModule } from '@angular/material/radio';
import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input-radio',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatRadioModule],
  template: `
    <p class="mb-2 text-sm font-medium text-gray-900">{{ label }}</p>
    <div class="w-full">
      <mat-radio-group [formControl]="control" [name]="nombre" class="w-full">
        <ul class="flex items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg">
          <li *ngFor="let item of items" class="flex-1 border-b border-gray-200 sm:border-b-0 sm:border-r px-2">
            <label for="horizontal-list-{{ item }}" class="flex items-center cursor-pointer py-2 w-full">
              <mat-radio-button id="horizontal-list-{{ item }}" [value]="item" class=""></mat-radio-button>
              <span class="ml-2 text-sm font-medium text-gray-900">{{ item }}</span>
            </label>
          </li>
        </ul>
      </mat-radio-group>
    </div>
  `,
})
export class InputRadioComponent {
  @Input() label!: string;
  @Input() control!: FormControl;
  @Input() items!: string[];
  @Input() nombre!: string;
  @Input() placeholder = '';
}
