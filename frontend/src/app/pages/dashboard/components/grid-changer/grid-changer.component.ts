import { Component, EventEmitter, OnInit, Output, HostListener } from '@angular/core';

@Component({
  selector: 'app-grid-changer',
  standalone: true,
  imports: [],
  templateUrl: './grid-changer.component.html',
  styleUrl: './grid-changer.component.css',
})
export class GridChangerComponent implements OnInit {
  grid = 3;
  @Output() gridChange: EventEmitter<number> = new EventEmitter<number>();
  maxCol = 3;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.verificaGrid(event.target.innerWidth);
  }

  cambiarGrid(number: number) {
    this.grid = number;
    this.gridChange.emit(number);
  }

  verificaGrid(width: number = window.innerWidth) {
    if (width < 640) {
      this.maxCol = 1;
      this.cambiarGrid(1);
    } else if (width < 1024) {
      this.maxCol = 2;
      this.cambiarGrid(2);
    } else {
      this.maxCol = 3;
      this.cambiarGrid(3);
    }
  }

  ngOnInit(): void {
    this.verificaGrid(); // Inicializa el grid según el tamaño de pantalla actual
  }

  deshabilitarSegunTamanio(tamanio: number) {
    return this.grid === tamanio || this.maxCol < tamanio;
  }
}
