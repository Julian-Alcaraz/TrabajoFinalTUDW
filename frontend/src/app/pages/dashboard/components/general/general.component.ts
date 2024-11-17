import { Component, OnInit } from '@angular/core';
import { BarGraphComponent } from '../bar-graph/bar-graph.component';
import { ConsultaService } from '../../../../services/consulta.service';
import { ChicoService } from '../../../../services/chico.service';

@Component({
  selector: 'app-general',
  standalone: true,
  imports: [BarGraphComponent],
  templateUrl: './general.component.html',
  styleUrl: './general.component.css',
})
export class GeneralComponent implements OnInit {
  currentYear: number;
  lastFourYears: number[];

  constructor(
    private _consultaService: ConsultaService,
    private _chicoService: ChicoService,
  ) {
    this.currentYear = new Date().getFullYear();
    this.lastFourYears = [ this.currentYear - 3, this.currentYear - 2, this.currentYear -1,this.currentYear];
  }

  dataChicosxAnio: any = [
    {
      label: 'No encontrados',
      data: [],
    },
  ];

  dataConsultaxAnio = [
    {
      label: 'No encontradas',
      data: [],
    },
  ];
  dataTipoConsultaxanio = [
    {
      label: 'No encontradas',
      data: [],
    },
    // {
    //   label: '2023',
    //   data: [
    //     200, //clinica
    //     100, //odontologia
    //     80, //oftalmologia
    //     90, //fonoa
    //   ],
    // },
  ];


  ngOnInit(): void {
    this.countChicosCargados();
    this.countConsultasxanio();
    this.countTypeConsultaxanio();
  }

  countChicosCargados() {
    this._chicoService.countChicosCargadosxAnios(this.currentYear).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.dataChicosxAnio = [
            {
              label: 'Chicos',
              data: response.data,
            },
          ];
        }
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  countConsultasxanio() {
    this._consultaService.countConsultaLastYears(this.currentYear).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.dataConsultaxAnio = [
            {
              label: 'Consultas',
              data: response.data,
            },
          ];
        }
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  countTypeConsultaxanio() {
    this._consultaService.countTypeConsultaLastYears(this.currentYear).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.dataTipoConsultaxanio=[]
          for (const year of this.lastFourYears) {
            this.dataTipoConsultaxanio.push({
              label: ''+year,
              data:response.data[year]
            })
          }
        }
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }
}
