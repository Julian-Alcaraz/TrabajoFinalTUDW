import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { PanelModule } from 'primeng/panel';
import Swal from 'sweetalert2';

import * as Constantes from '@app/common/const/const';
import * as MostrarNotificacion from '@utils/notificaciones/mostrar-notificacion';
import { Taller } from '@app/models/taller.model';
import { LoadingComponent } from '@components/loading/loading.component';
import { TallerService } from '@app/services/taller.service';
import { VerTallerComponent } from '../ver-taller/ver-taller.component';
import { Usuario } from '@app/models/usuario.model';
import { SessionService } from '@app/services/session.service';
import { GLOBAL } from '@config/global';
import { PaginadorPersonalizado } from '@app/utils/paginador/paginador-personalizado';

@Component({
  selector: 'app-lista-taller',
  standalone: true,
  imports: [MatTableModule, MatSortModule, TagModule, TooltipModule, LoadingComponent, MatPaginator, MatPaginatorModule, PanelModule, IftaLabelModule, InputTextModule, InputNumberModule, SelectModule, ReactiveFormsModule],
  templateUrl: './lista-taller.component.html',
  styleUrl: './lista-taller.component.css',
  providers: [{ provide: MatPaginatorIntl, useClass: PaginadorPersonalizado }],
})
export class ListaTallerComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginador: MatPaginator | null = null;
  @ViewChild(MatSort) sort!: MatSort;
  private _liveAnnouncer = inject(LiveAnnouncer);

  public talleres: MatTableDataSource<Taller>;
  public displayedColumns: string[] = ['numero', 'nombre', 'fecha', 'esTaller', 'frecuencia', 'duracion', 'destinatarios', 'especialidad', 'action'];

  public con = Constantes;
  public identidad: Usuario | null = null;
  public searchTerms: any = {};
  public searching = true;
  public resultsLength = 0;
  public colapsarFiltros = false;

  // Form controls solo para que no tenga valor al principio.
  public duracionControl: FormControl = new FormControl(null);
  public estadoControl: FormControl = new FormControl(null);
  public turnoControl: FormControl = new FormControl(null);
  public frecuenciaControl: FormControl = new FormControl(null);
  public destinatariosControl: FormControl = new FormControl(null);
  public especialidadControl: FormControl = new FormControl(null);
  public conjuntoConControl: FormControl = new FormControl(null);
  public esTallerControl: FormControl = new FormControl(null);

  public estadoOptions: any[] = [
    { nombre: 'Habilitado', valor: false },
    { nombre: 'Deshabilitado', valor: true },
  ];
  public frecuenciaOptions: string[] = this.con.FrecuenciaEnum;
  public turnoOptions: string[] = this.con.TurnoTalleresEnum;
  public duracionOptions: number[] = this.con.DuracionEnum;
  public destinatariosOptions: string[] = this.con.DestinatariosEnum;
  public especialidadOptions: string[] = this.con.EspecialidadEnum;
  public conjuntoConOptions: string[] = this.con.ConjuntoConEnum;
  public siNoOptions: any[] = [
    { nombre: 'Si', valor: true },
    { nombre: 'No', valor: false },
  ];
  public mensajes = '';

  constructor(
    private snackBar: MatSnackBar,
    private _tallerService: TallerService,
    private _dialog: MatDialog,
    private _sessionService: SessionService,
  ) {
    this.talleres = new MatTableDataSource<Taller>([]);
    this.talleres.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'estado':
          return item.deshabilitado ? 1 : 0;
        default:
          return item[property];
      }
    };
    this.identidad = this._sessionService.getIdentidad();
    if (this.identidad && this.identidad?.roles_ids) {
      if (!(this.identidad?.roles_ids.includes(GLOBAL.ID_ADMIN) || this.identidad?.roles_ids?.includes(GLOBAL.ID_PROFESIONAL))) {
        this.displayedColumns.pop();
      }
    }
  }

  ngOnInit(): void {
    this.obtenerTalleres();
    this.activateTableFilter();
  }

  ngAfterViewInit() {
    this.talleres.paginator = this.paginador;
    this.talleres.sort = this.sort;
  }

  activateTableFilter() {
    this.talleres.filterPredicate = (taller: any, filter: string) => {
      const searchTerms = JSON.parse(filter);

      const matchesNombre = searchTerms.nombre ? sacarAcentos(taller.nombre.toLowerCase()).includes(searchTerms.nombre.toLowerCase()) : true;
      const matchesEstado = searchTerms.estado !== undefined ? taller.deshabilitado === JSON.parse(searchTerms.estado) : true;
      const matchesFrecuencia = searchTerms.frecuencia ? taller.frecuencia === searchTerms.frecuencia : true;
      const matchesTurno = searchTerms.turno ? taller.turno === searchTerms.turno : true;
      const matchesDuracion = searchTerms.duracion ? taller.duracion === searchTerms.duracion : true;
      const matchesDestinatarios = searchTerms.destinatarios ? taller.destinatarios === searchTerms.destinatarios : true;
      const matchesEspecialidad = searchTerms.especialidad ? taller.especialidad.nombre === searchTerms.especialidad : true;
      const matchesConjuntoCon = searchTerms.conjuntoCon ? taller.conjunto_con === searchTerms.conjuntoCon : true;
      const matchesEsTaller = searchTerms.esTaller !== undefined ? taller.es_taller === JSON.parse(searchTerms.esTaller) : true;

      this.actualizarMensajes(searchTerms.nombre, searchTerms.estado, searchTerms.frecuencia, searchTerms.turno, searchTerms.duracion, searchTerms.destinatarios, searchTerms.especialidad, searchTerms.conjuntoCon, searchTerms.esTaller);
      return matchesNombre && matchesEstado && matchesFrecuencia && matchesTurno && matchesDuracion && matchesDestinatarios && matchesEspecialidad && matchesConjuntoCon && matchesEsTaller;
    };
  }

  applyFilter(event: any, filtro?: string) {
    if (filtro === 'filtroNombre') {
      const nombreValue = sacarAcentos(event.target.value.trim().toLowerCase());
      this.searchTerms.nombre = nombreValue;
    } else if (filtro === 'filtroEstado') {
      const estadoValue = event.value;
      this.searchTerms.estado = estadoValue !== undefined ? estadoValue : undefined;
    } else if (filtro === 'filtroFrecuencia') {
      const frecuenciaValue = event.value;
      this.searchTerms.frecuencia = frecuenciaValue !== undefined ? frecuenciaValue : undefined;
    } else if (filtro === 'filtroTurno') {
      const turnoValue = event.value;
      this.searchTerms.turno = turnoValue !== undefined ? turnoValue : undefined;
    } else if (filtro === 'filtroDuracion') {
      const duracionValue = event.value;
      this.searchTerms.duracion = duracionValue !== undefined ? duracionValue : undefined;
    } else if (filtro === 'filtroDestinatarios') {
      const destinatariosValue = event.value;
      this.searchTerms.destinatarios = destinatariosValue !== undefined ? destinatariosValue : undefined;
    } else if (filtro === 'filtroEspecialidad') {
      const especialidadValue = event.value;
      this.searchTerms.especialidad = especialidadValue !== undefined ? especialidadValue : undefined;
    } else if (filtro === 'filtroConjuntoCon') {
      const conjuntoConValue = event.value;
      this.searchTerms.conjuntoCon = conjuntoConValue !== undefined ? conjuntoConValue : undefined;
    } else if (filtro === 'filtroEsTaller') {
      const esTallerValue = event.value;
      this.searchTerms.esTaller = esTallerValue !== undefined ? esTallerValue : undefined;
    }
    this.talleres.filter = JSON.stringify(this.searchTerms);
    if (this.talleres.paginator) this.talleres.paginator.firstPage();
  }

  actualizarMensajes(filtroNombre: any, filtroEstado: any, filtroFrecuencia: any, filtroTurno: any, filtroDuracion: any, filtroDestinatarios: any, filtroEspecialidad: any, filtroConjuntoCon: any, filtroEsTaller: any): void {
    this.mensajes = 'No se encontró un taller con:';
    if (filtroNombre) this.mensajes += ` Nombre: '${filtroNombre}'. `;
    if (filtroEstado) this.mensajes += ` Estado: ${filtroEstado ? 'Deshabilitado' : 'Habilitado'}.`;
    if (filtroFrecuencia) this.mensajes += ` Frecuencia: '${filtroFrecuencia}'. `;
    if (filtroDuracion) this.mensajes += ` Duracion: '${filtroDuracion}'. `;
    if (filtroEspecialidad) this.mensajes += ` Especialidad: '${filtroEspecialidad}'. `;
    if (filtroDestinatarios) this.mensajes += ` Destinatarios: '${filtroDestinatarios}'. `;
    if (filtroConjuntoCon) this.mensajes += ` Conjunto con: '${filtroConjuntoCon}'. `;
    if (filtroEsTaller) this.mensajes += ` Es Taller: '${filtroEsTaller ? 'Si' : 'No'}'. `;
    if (filtroTurno) this.mensajes += ` Turno: '${filtroTurno}'. `;
  }

  limpiarFiltro(filtroALimpiar: string) {
    this.searchTerms[filtroALimpiar] = undefined;
    this.talleres.filter = JSON.stringify(this.searchTerms);
    if (this.talleres.paginator) this.talleres.paginator.firstPage();
  }

  obtenerTalleres() {
    this.searching = true;
    this._tallerService.obtenerTodosTalleres().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.talleres.data = response.data;
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

  habilitar(id: number) {
    Swal.fire({
      title: '¿Habilitar taller?',
      showDenyButton: true,
      confirmButtonColor: '#3f77b4',
      confirmButtonText: 'Confirmar',
      denyButtonText: 'Cancelar',
    }).then((result: any) => {
      if (result.isConfirmed) {
        const edit = { deshabilitado: false };
        this.modificarTaller(id, edit);
      }
    });
  }

  inhabilitar(id: number) {
    Swal.fire({
      title: '¿Deshabilitar taller?',
      showDenyButton: true,
      confirmButtonColor: '#3f77b4',
      confirmButtonText: 'Confirmar',
      denyButtonText: `Cancelar`,
    }).then((result: any) => {
      if (result.isConfirmed) {
        const edit = { deshabilitado: true };
        this.modificarTaller(id, edit);
      }
    });
  }

  modificarTaller(id: number, edit: any) {
    this._tallerService.modificarTaller(id, edit).subscribe({
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
      text: 'Para poder ver o editar el taller, usted debe habilitarlo',
      icon: 'warning',
      showDenyButton: true,
      confirmButtonColor: '#3f77b4',
      confirmButtonText: 'Habilitar taller',
      denyButtonText: 'Cancelar',
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.habilitar(id);
      }
    });
  }

  verDetallesTaller(id: number) {
    const dialogRef = this._dialog.open(VerTallerComponent, { panelClass: 'full-screen-dialog', data: { id } });
    dialogRef.afterClosed().subscribe((recargar) => {
      if (recargar) {
        this.obtenerTalleres();
      }
    });
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) this._liveAnnouncer.announce(`Ordenado ${sortState.direction}`);
    else this._liveAnnouncer.announce('Orden eliminado');
  }
}

function sacarAcentos(text: string): string {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}
