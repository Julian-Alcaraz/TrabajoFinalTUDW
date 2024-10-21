import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input-number',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './input-number.component.html',
  styleUrl: './input-number.component.css'
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
