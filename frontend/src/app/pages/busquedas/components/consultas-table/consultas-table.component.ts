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
  @Input() displayedColumns: string[] = ['numero', 'type', 'nombre', 'documento', 'sexo', 'edad', 'fecha', 'obra_social', 'fechaNac', 'direccionChico', 'telefono', 'derivaciones', 'institucion', 'curso', 'observaciones', 'profesional'];
  // por defecto todas las columnas
  public dataSource: MatTableDataSource<Consulta>;

  constructor(private _dialog: MatDialog) {
    this.dataSource = new MatTableDataSource(this.consultas);
    this.dataSource.sort = this.sort;
  }
  private _liveAnnouncer = inject(LiveAnnouncer);

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.consultas);
    this.dataSource.sort = this.sort;
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['consultas']) {
      this.dataSource.data = changes['consultas'].currentValue;
    }
  }
}
