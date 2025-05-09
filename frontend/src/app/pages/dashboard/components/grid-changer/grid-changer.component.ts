import { Component, EventEmitter, OnInit, Output } from '@angular/core';

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
  cambiarGrid(number: number) {
    this.grid = number;
    this.gridChange.emit(number);
  }

  verificaGrid() {
    if (window.innerWidth < 640) {
      this.maxCol = 1;
      this.cambiarGrid(1);
    } else if (window.innerWidth < 768) {
      this.cambiarGrid(2);
      this.maxCol = 2;
    }
  }

  ngOnInit(): void {
    this.verificaGrid();
  }

  deshabilitarSegunTamanio(tamanio: number) {
    return this.grid === tamanio || this.maxCol < tamanio;
  }
}
