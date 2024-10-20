import { Component, Input, Output, EventEmitter} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input-select',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './input-select.component.html',
  styleUrl: './input-select.component.css',
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
