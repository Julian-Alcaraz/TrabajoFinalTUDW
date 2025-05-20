import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-expand-compress-button',
  standalone: true,
  imports: [],
  templateUrl: './expand-compress-button.component.html',
})
export class ExpandCompressButtonComponent implements OnChanges {
  @Input() grid = 3;
  @Output() actualizarGraficos: EventEmitter<any> = new EventEmitter<any>();
  divElement!: HTMLElement;
  toggleGraph(event: Event) {
    const divElement = (event.currentTarget as HTMLElement).closest('div');
    if (!divElement) return;
    this.divElement = divElement;
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['grid']) {
      this.resetGraphColumns();
    }
  }
  
  resetGraphColumns() {
    if (this.divElement) {
      this.divElement.classList.remove('col-span-1', 'col-span-2', 'col-span-3');
    }
  }
}
