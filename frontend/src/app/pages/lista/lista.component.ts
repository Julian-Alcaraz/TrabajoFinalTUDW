import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AfterViewInit, Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';

import * as MostrarNotificacion from '../../utils/notificaciones/mostrar-notificacion';
import { Consulta } from '../../models/consulta.model';
import { ConsultaService } from '../../services/consulta.service';
import { LoadingComponent } from '../../components/loading/input-loading.component';
import { DataConsultaPipe } from '../../utils/pipes/data-consulta.pipe';

//
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-lista',
  standalone: true,
  imports: [CommonModule, MatTableModule, LoadingComponent, DatePipe, MatPaginator, DataConsultaPipe, MatSortModule],
  // imports: [CommonModule, ButtonModule, TableModule],
  templateUrl: './lista.component.html',
  styleUrl: './lista.component.css',
})
export class ListaComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;

  public consultas: MatTableDataSource<Consulta>;
  public consultasTest: Consulta[] = [];
  public resultsLength = 0;
  public displayedColumns: string[] = ['numero', 'type', 'nombre', 'sexo', 'edad', 'fecha', 'obra_social', 'documento', 'fechaNac', 'direccionChico', 'telefono', 'derivaciones', 'institucion', 'curso', 'observaciones', 'profesional'];
  public searching = false;

  public products = [
    { code: 'f230fh0g3', name: 'Bamboo Watch', category: 'Accessories', quantity: 24 },
    { code: 'nvklal433', name: 'Black Watch', category: 'Accessories', quantity: 61 },
    { code: 'zz21cz3c1', name: 'Blue Band', category: 'Fitness', quantity: 2 },
  ];

  public colsTest = [
    { field: 'id', header: 'ID' },
    { field: 'type', header: 'Tipo' },
    { field: 'consulta.chico.nombre', header: 'Nombre' },
    { field: 'consulta.chico.sexo', header: 'Sexo' },
  ];

  constructor(
    private _consultaService: ConsultaService,
    private snackBar: MatSnackBar,
  ) {
    this.consultas = new MatTableDataSource<Consulta>([]);
  }

  ngOnInit(): void {
    this.obtenerConsultas();
  }

  toggleDarkMode() {
    const element = document.querySelector('html');
    element?.classList.toggle('my-app-dark');
  }

  obtenerConsultas() {
    this._consultaService.obtenerConsultas().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.consultas = new MatTableDataSource(response.data);
          this.consultasTest = response.data;
          this.resultsLength = response.data.length;
          this.consultas.sort = this.sort;
        }
        this.searching = false;
      },
      error: (err: any) => {
        MostrarNotificacion.mensajeErrorServicio(this.snackBar, err);
        this.searching = false;
      },
    });
  }

  private _liveAnnouncer = inject(LiveAnnouncer);

  ngAfterViewInit() {
    this.consultas.sort = this.sort;
  }

  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}
