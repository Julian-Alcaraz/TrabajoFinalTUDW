import { AfterViewInit, Component, inject, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatDialog } from '@angular/material/dialog';

import { Consulta } from '../../../../models/consulta.model';
import { VerConsultaComponent } from '../../../../components/ver-consulta/ver-consulta.component';
import { PaginadorPersonalizado } from '../../../../utils/paginador/paginador-personalizado';
import { TooltipModule } from 'primeng/tooltip';
import { ConsultaService } from '../../../../services/consulta.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as MostrarNotificacion from '../../../../utils/notificaciones/mostrar-notificacion';
import { SessionService } from '../../../../services/session.service';
import { Usuario } from '../../../../models/usuario.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-consultas-table',
  standalone: true,
  imports: [CommonModule, MatSortModule, MatTableModule, MatPaginator, TooltipModule],
  templateUrl: './consultas-table.component.html',
  styleUrl: './consultas-table.component.css',
  providers: [{ provide: MatPaginatorIntl, useClass: PaginadorPersonalizado }],
})
export class ConsultasTableComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginador: MatPaginator | null = null;

  @Input() consultas: Consulta[] = [];
  @Input() displayedColumns: string[] = ['numero', 'type', 'nombre', 'documento', 'sexo', 'edad', 'fecha', 'obra_social', 'fechaNac', 'direccionChico', 'telefono', 'derivaciones', 'institucion', 'curso', 'observaciones', 'profesional', 'accion'];
  // por defecto todas las columnas
  public dataSource: MatTableDataSource<Consulta>;
  identidad: Usuario | null = null;
  constructor(
    private _dialog: MatDialog,
    private _consultaService: ConsultaService,
    private _sessionService: SessionService,
    private snackBar: MatSnackBar,
  ) {
    this.dataSource = new MatTableDataSource(this.consultas);
    this.dataSource.sort = this.sort;
  }
  private _liveAnnouncer = inject(LiveAnnouncer);

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.consultas);
    this.dataSource.sort = this.sort;
    this.identidad = this._sessionService.getIdentidad();
    if (this.identidad?.roles_ids?.includes(1) || this.identidad?.roles_ids?.includes(2)) {
      this.displayedColumns.push('accion');
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginador;
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  verConsulta(id: number) {
    this._dialog.open(VerConsultaComponent, { panelClass: 'full-screen-dialog', data: id });
  }

  eliminar(event: Event, element: Consulta) {
    event.stopPropagation();
    Swal.fire({
      title: '¿Deseas borrar consulta?',
      text: 'La consulta se borrara permantenmente.',
      showDenyButton: true,
      confirmButtonColor: '#3f77b4',
      confirmButtonText: 'Confirmar',
      denyButtonText: `Cancelar`,
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.borrarConsulta(element);
      }
    });
  }

  borrarConsulta(element: Consulta) {
    this._consultaService.borrarLogico(element.id).subscribe({
      next: (response: any) => {
        const index = this.dataSource.data.indexOf(element);
        if (index > -1) {
          this.dataSource.data.splice(index, 1);
          this.dataSource.data = [...this.dataSource.data];
        }
        MostrarNotificacion.mensajeExito(this.snackBar, response.message);
      },
      error: (err) => {
        MostrarNotificacion.mensajeError(this.snackBar, err);
      },
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['consultas']) {
      this.dataSource.data = changes['consultas'].currentValue;
    }
  }
}
