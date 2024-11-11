import { Component, inject, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { Consulta } from '../../../../models/consulta.model';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { VerConsultaComponent } from '../../../../components/ver-consulta/ver-consulta.component';
import { PaginadorPersonalizado } from '../../../../utils/paginador/paginador-personalizado';

@Component({
  selector: 'app-consultas-table',
  standalone: true,
  imports: [CommonModule, MatSortModule, MatTableModule, MatPaginator],
  templateUrl: './consultas-table.component.html',
  styleUrl: './consultas-table.component.css',
  providers: [{ provide: MatPaginatorIntl, useClass: PaginadorPersonalizado }],

})
export class ConsultasTableComponent implements OnInit , OnChanges{
  @ViewChild(MatSort) sort!: MatSort;
  @Input() consultas: Consulta[] = [];
  // por defecto todas las columnas
  @Input() displayedColumns: string[] = ['numero', 'type', 'nombre', 'sexo', 'edad', 'fecha', 'obra_social', 'documento', 'fechaNac', 'direccionChico', 'telefono', 'derivaciones', 'institucion', 'curso', 'observaciones', 'profesional'];
  dataSource: MatTableDataSource<Consulta>;

  constructor(private _dialog: MatDialog) {
    this.dataSource = new MatTableDataSource(this.consultas);
    this.dataSource.sort = this.sort;
  }
  private _liveAnnouncer = inject(LiveAnnouncer);

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.consultas);
    this.dataSource.sort = this.sort;
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
      console.log('Consultas has changed:', changes['consultas']);
      this.dataSource.data = changes['consultas'].currentValue;
    }
  }
}
