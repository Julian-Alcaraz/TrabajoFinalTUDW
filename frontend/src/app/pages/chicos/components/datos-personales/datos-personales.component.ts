import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Chico } from '@models/chico.model';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '@components/loading/loading.component';
import { AgregarConsultaComponent } from '../agregar-consulta/agregar-consulta.component';

@Component({
  selector: 'app-datos-personales',
  standalone: true,
  imports: [CommonModule, LoadingComponent, AgregarConsultaComponent],
  templateUrl: './datos-personales.component.html',
})
export class DatosPersonalesComponent implements OnChanges {
  @Input() chico: Chico | null = null;
  @Input() resultsLength = 0;
  @Input() searchingConsultas = false;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['chico']) this.chico = changes['chico'].currentValue;
    if (changes['resultsLength']) this.resultsLength = changes['resultsLength'].currentValue;
    if (changes['searchingConsultas']) this.searchingConsultas = changes['searchingConsultas'].currentValue;
  }
}
