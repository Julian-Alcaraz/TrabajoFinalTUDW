import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Consulta } from '../../models/consulta.model';
import { ConsultasTableComponent } from './components/consultas-table/consultas-table.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ConsultasxanioComponent } from './components/consultasxanio/consultasxanio.component';
import { PersonalizadaComponent } from './components/personalizada/personalizada.component';
@Component({
  selector: 'app-busquedas',
  standalone: true,
  imports: [CommonModule, ConsultasTableComponent, ConsultasxanioComponent, PersonalizadaComponent],

  templateUrl: './busquedas.component.html',
  styleUrl: './busquedas.component.css',
})
export class BusquedasComponent implements OnInit, OnDestroy {
  consultas: Consulta[] | undefined | null = [];
  routeSub: any;
  currentParam: any;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.routeSub = this._route.queryParams.subscribe((params) => {
      this.currentParam = params['consulta']; // Lógica adicional cuando el parámetro cambia console.log('Parámetro actual:', this.currentParam);
      this.consultas=null
    });
  }
  ngOnDestroy() {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  cambiarParam(value: number) {
    this._router.navigate([], { relativeTo: this._route, queryParams: { consulta: value } }); // mantiene otros parámetros de la URL intactos
  }

  mostrarConsultas(consultas:any) {
    console.log("Consultas Obtenidads",consultas);
    this.consultas=consultas
  }
}
