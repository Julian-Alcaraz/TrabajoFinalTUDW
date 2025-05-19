import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-expand-compress-button',
  standalone: true,
  imports: [],
  templateUrl: './expand-compress-button.component.html',
})
export class ExpandCompressButtonComponent {
  @Input() grid = 3;
  @Output() actualizarGraficos: EventEmitter<any> = new EventEmitter<any>();

  toggleGraph(event: Event) {
    const divElement = (event.currentTarget as HTMLElement).closest('div');
    if (!divElement) return;
    divElement.classList.toggle('col-span-' + this.grid);
    // maneja el icono del boton
    const iconElement = divElement.querySelector('i');
    if (iconElement) {
      if (divElement.classList.contains('col-span-' + this.grid)) {
        iconElement.className = 'fa-solid fa-down-left-and-up-right-to-center';
      } else {
        iconElement.className = 'fa-solid fa-up-right-and-down-left-from-center';
      }
    }

    this.actualizarGraficos.emit('');
  }
}
