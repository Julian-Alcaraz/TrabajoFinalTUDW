import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { ConsultaService } from '../../services/consulta.service';
import { Consulta } from '../../models/consulta.model';
import { ConsultasTableComponent } from './components/consultas-table/consultas-table.component';

@Component({
  selector: 'app-busquedas',
  standalone: true,
  imports: [CommonModule, DatePickerModule, FormsModule,ConsultasTableComponent],
  templateUrl: './busquedas.component.html',
  styleUrl: './busquedas.component.css',
})
export class BusquedasComponent implements OnInit {
  date: Date | undefined;
  consultas: Consulta[] | undefined | null = [];
  maxDate: Date;

  constructor(private _consultasService: ConsultaService) {
    const currentYear = new Date().getFullYear();
    this.maxDate = new Date(currentYear, 11, 31); // 11 es diciembre (meses son 0 indexados)
  }

  ngOnInit(): void {
    console.log(this.date);
  }
  buscar() {
    if (this.date) {
      const anio = this.date.getFullYear();
      console.log(this.date.getFullYear());
      if (anio) {
        this._consultasService.obtenerConsultasxAnio(anio).subscribe({
          next: (response: any) => {
            console.log(response);
            this.consultas=response.data
          },
          error: (err) => {
            console.log(err);
          },
        });
      }
    }
  }
}
