import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { inject } from '@angular/core';
import Swal from 'sweetalert2';

import * as MostrarNotificacion from '../../../utils/notificaciones/mostrar-notificacion';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PaginadorPersonalizado } from '../../../utils/paginador/paginador-personalizado';
import { LoadingComponent } from '../../../components/loading/loading.component';
import { Curso } from '../../../models/curso.model';
import { CursoService } from '../../../services/curso.service';
import { ModalCursoComponent } from './curso/modal-curso/modal-curso.component';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-cursos',
  standalone: true,
  imports: [CommonModule, TagModule, MatTableModule, MatPaginatorModule, LoadingComponent, MatSortModule, TooltipModule],
  templateUrl: './cursos.component.html',
  styleUrl: './cursos.component.css',
  providers: [{ provide: MatPaginatorIntl, useClass: PaginadorPersonalizado }],
})
export class CursosComponent implements OnInit, AfterViewInit {
  private _liveAnnouncer = inject(LiveAnnouncer);

  public cursos: MatTableDataSource<Curso>;
  public resultsLength = 0;
  public searching = false;

  @ViewChild(MatPaginator) paginador: MatPaginator | null = null;
  @ViewChild('cursoModal') cursoModal!: TemplateRef<any>;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['numero', 'nombre', 'nivel', 'cantidadConsultas', 'habilitado', 'action'];
  constructor(
    private _cursoService: CursoService,
    private snackBar: MatSnackBar,
    private _dialog: MatDialog,
  ) {
    this.cursos = new MatTableDataSource<Curso>([]);
  }

  ngOnInit(): void {
    this.obtenerCursos();
  }

  ngAfterViewInit() {
    this.cursos.paginator = this.paginador;
    this.cursos.sort = this.sort;
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Ordenado ${sortState.direction}`);
    } else {
      this._liveAnnouncer.announce('Orden eliminado');
    }
  }

  obtenerCursos() {
    this.searching = true;
    this._cursoService.obtenerTodosCursos().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.cursos.data = response.data;
          this.resultsLength = response.data.length;
        }
        this.searching = false;
      },
      error: (err: any) => {
        MostrarNotificacion.mensajeErrorServicio(this.snackBar, err);
        this.searching = false;
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.cursos.filter = filterValue.trim().toLowerCase();
  }

  habilitar(id: number) {
    Swal.fire({
      title: '¿Habilitar curso?',
      text: 'El curso se hará visible para los usuarios y podrán cargar consultas a este.',
      showDenyButton: true,
      confirmButtonColor: '#3f77b4',
      confirmButtonText: 'Confirmar',
      denyButtonText: `Cancelar`,
    }).then((result: any) => {
      if (result.isConfirmed) {
        const edit = { deshabilitado: false };
        this.modificarCurso(id, edit);
      }
    });
  }

  inhabilitar(id: number) {
    Swal.fire({
      title: '¿Deshabilitar curso?',
      text: 'El curso dejará de ser visible para los usuarios y no se podrán cargar más consultas a este.',
      showDenyButton: true,
      confirmButtonColor: '#3f77b4',
      confirmButtonText: 'Confirmar',
      denyButtonText: `Cancelar`,
    }).then((result: any) => {
      if (result.isConfirmed) {
        const edit = { deshabilitado: true };
        this.modificarCurso(id, edit);
      }
    });
  }

  modificarCurso(id: number, edit: any) {
    this._cursoService.modificarCurso(id, edit).subscribe({
      next: (response: any) => {
        if (response.success) {
          MostrarNotificacion.mensajeExito(this.snackBar, response.message);
          this.ngOnInit();
        } else {
          MostrarNotificacion.mensajeError(this.snackBar, response.message);
        }
      },
      error: (err: any) => {
        MostrarNotificacion.mensajeErrorServicio(this.snackBar, err);
      },
    });
  }

  notificar(id: number) {
    Swal.fire({
      title: 'Error',
      text: 'Para poder editar el curso, usted debe habilitarlo',
      icon: 'warning',
      showDenyButton: true,
      confirmButtonColor: '#3f77b4',
      confirmButtonText: 'Habilitar curso',
      denyButtonText: 'Cancelar',
    }).then((result: any) => {
      if (result.isConfirmed) {
        const edit = { deshabilitado: false };
        this.modificarCurso(id, edit);
      }
    });
  }

  editarCurso(curso: Curso) {
    const modal = this._dialog.open(ModalCursoComponent, { panelClass: 'full-screen-dialog', data: { curso } });
    modal.afterClosed().subscribe((actualizar) => {
      if (actualizar) {
        this.obtenerCursos();
      }
    });
  }

  nuevoCurso() {
    const modal = this._dialog.open(ModalCursoComponent, { panelClass: 'full-screen-dialog' });
    modal.afterClosed().subscribe((actualizar) => {
      if (actualizar) {
        this.obtenerCursos();
      }
    });
  }
}
