import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { Consulta } from '../../../../models/consulta.model';
import { ConsultaService } from '../../../../services/consulta.service';
import { CommonModule } from '@angular/common';
import { IftaLabelModule } from 'primeng/iftalabel';
import { LoadingComponent } from '../../../../components/loading/loading.component';

@Component({
  selector: 'app-consultasxanio',
  standalone: true,
  imports: [CommonModule, DatePickerModule, FormsModule, ReactiveFormsModule, IftaLabelModule, LoadingComponent],
  templateUrl: './consultasxanio.component.html',
  styleUrl: './consultasxanio.component.css',
})
export class ConsultasxanioComponent {
  date: Date | undefined;
  consultas: Consulta[] | undefined | null = [];
  maxDate: Date;
  buscarForm: FormGroup;
  searching = false;
  @Output() consultasEmitidas = new EventEmitter<Consulta[]>();
  constructor(
    private _consultasService: ConsultaService,
    private fb: FormBuilder,
  ) {
    const currentYear = new Date().getFullYear();
    this.maxDate = new Date(currentYear, 11, 31); // 11 es diciembre (meses son 0 indexados)
    this.buscarForm = this.fb.group({ year: [null, Validators.required] });

    // comentar esto para que no busque automaticamente
    this.date = new Date();
    this.buscar();
  }
  enviarConsultas(data: Consulta[]) {
    this.consultasEmitidas.emit(data);
  }
  buscar() {
    this.searching = true;
    if (this.date) {
      const anio = this.date.getFullYear();
      if (anio) {
        this._consultasService.obtenerConsultasxAnio(anio).subscribe({
          next: (response: any) => {
            this.consultas = response.data;
            this.searching = false;
            this.enviarConsultas(response.data);
          },
          error: (err) => {
            console.log(err);
          },
        });
      }
    }
  }
}
