import { Component, inject, Input, OnInit, ViewChild } from '@angular/core';
import { LoadingComponent } from '../../../../components/loading/input-loading.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { Consulta } from '../../../../models/consulta.model';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort,MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-consultas-table',
  standalone: true,
  imports: [CommonModule, MatSortModule,LoadingComponent,MatTableModule,MatPaginator],
  templateUrl: './consultas-table.component.html',
  styleUrl: './consultas-table.component.css'
})
export class ConsultasTableComponent implements OnInit{
  @ViewChild(MatSort) sort!: MatSort;
  @Input() consultas: Consulta[]=[];
  dataSource:MatTableDataSource<Consulta>;
  public displayedColumns: string[] = ['numero', 'type', 'nombre', 'sexo', 'edad', 'fecha', 'obra_social', 'documento', 'fechaNac', 'direccionChico', 'telefono', 'derivaciones', 'institucion', 'curso', 'observaciones', 'profesional'];

  constructor(){
    this.dataSource= new MatTableDataSource(this.consultas);
    // console.log(this.consultas,"Consutas en table")
    this.dataSource.sort = this.sort;
  }
  private _liveAnnouncer = inject(LiveAnnouncer);

  ngOnInit() {
    this.dataSource= new MatTableDataSource(this.consultas);
    console.log(this.consultas,"Consutas en table")
    this.dataSource.sort = this.sort;
  }
  announceSortChange(sortState: Sort){
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

}
