import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Consulta } from '@models/consulta.model';
import { ConsultasTableComponent } from './components/consultas-table/consultas-table.component';
import { ConsultasxanioComponent } from './components/consultasxanio/consultasxanio.component';
import { PersonalizadaComponent } from './components/personalizada/personalizada.component';
import { TabsComponent } from '@components/tabs/tabs.component';
@Component({
  selector: 'app-busquedas',
  standalone: true,
  imports: [CommonModule, ConsultasTableComponent, ConsultasxanioComponent, PersonalizadaComponent, TabsComponent],
  templateUrl: './busquedas.component.html',
  styleUrl: './busquedas.component.css',
})
export class BusquedasComponent {
  consultas: Consulta[] | undefined | null = null;
  routeSub: any;
  currentParam: number | null = null;

  escucharParam(value: number) {
    if (value !== this.currentParam) {
      this.currentParam = value;
      this.consultas = null;
    }
  }

  mostrarConsultas(consultas: any) {
    this.consultas = consultas;
  }
}
