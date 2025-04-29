import { CommonModule } from '@angular/common';
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
import { MarcoService } from '@app/services/marco.service';
import { Marco } from '@app/models/marco.model';
import { Especialidad } from '@app/models/especialidad.model';
import { EspecialidadService } from '@app/services/especialidad.service';
import { InstitucionService } from '@app/services/institucion.service';
import { Institucion } from '@app/models/institucion.model';
import { Curso } from '@app/models/curso.model';
import { CursoService } from '@app/services/curso.service';

@Component({
  selector: 'app-lista-taller',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSortModule, TagModule, TooltipModule, LoadingComponent, MatPaginator, MatPaginatorModule, PanelModule, IftaLabelModule, InputTextModule, InputNumberModule, SelectModule, ReactiveFormsModule],
  templateUrl: './lista-taller.component.html',
  providers: [{ provide: MatPaginatorIntl, useClass: PaginadorPersonalizado }],
})
export class ListaTallerComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginador: MatPaginator | null = null;
  @ViewChild(MatSort) sort!: MatSort;
  private _liveAnnouncer = inject(LiveAnnouncer);

  public talleres: MatTableDataSource<Taller>;
  public displayedColumns: string[] = ['numero', 'nombre', 'fecha', 'esTaller', 'frecuencia', 'duracion', 'destinatarios', 'especialidad', 'action'];

  public con = Constantes;
  public marcos: Marco[] = [];
  public marcosOriginales: Marco[] = [];
  public especialidades: Especialidad[] = [];
  public especialidadesOriginales: Especialidad[] = [];
  public instituciones: Institucion[] = [];
  public cursos: Curso[] = [];
  public identidad: Usuario | null = null;
  public searchTerms: any = {};
  public resultsLength = 0;
  public loadingCursos = false;
  public loadingInstituciones = false;
  public loadingMarcos = false;
  public loadingEspecialidades = false;
  public searching = true;
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
  public marcoControl: FormControl = new FormControl(null);
  public institucionControl: FormControl = new FormControl(null);
  public cursoControl: FormControl = new FormControl(null);

  public estadoOptions: any[] = [
    { nombre: 'Habilitado', valor: false },
    { nombre: 'Deshabilitado', valor: true },
  ];
  public frecuenciaOptions: string[] = this.con.FrecuenciaEnum;
  public turnoOptions: string[] = this.con.TurnoTalleresEnum;
  public duracionOptions: number[] = this.con.DuracionEnum;
  public destinatariosOptions: string[] = this.con.DestinatariosEnum;
  public conjuntoConOptions: string[] = this.con.ConjuntoConEnum;
  public siNoOptions: any[] = [
    { nombre: 'Si', valor: true },
    { nombre: 'No', valor: false },
  ];
  public mensajes = '';

  constructor(
    private snackBar: MatSnackBar,
    private _dialog: MatDialog,
    private _tallerService: TallerService,
    private _institucionService: InstitucionService,
    private _marcoService: MarcoService,
    private _especialidadService: EspecialidadService,
    private _cursoService: CursoService,
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
    this.obtenerEspecialidades();
    this.obtenerMarcos();
    this.obtenerInstituciones();
    this.obtenerCursos();
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
      const matchesMarco = searchTerms.marco ? taller.marco.nombre === searchTerms.marco : true;
      const matchesInstitucion = searchTerms.institucion ? taller.institucion.nombre === searchTerms.institucion : true;
      const matchesCurso = searchTerms.curso ? taller.curso.nombre === searchTerms.curso : true;

      this.actualizarMensajes(searchTerms.nombre, searchTerms.estado, searchTerms.frecuencia, searchTerms.turno, searchTerms.duracion, searchTerms.destinatarios, searchTerms.especialidad, searchTerms.conjuntoCon, searchTerms.esTaller, searchTerms.marco, searchTerms.institucion, searchTerms.curso);
      return matchesNombre && matchesEstado && matchesFrecuencia && matchesTurno && matchesDuracion && matchesDestinatarios && matchesEspecialidad && matchesConjuntoCon && matchesEsTaller && matchesMarco && matchesInstitucion && matchesCurso;
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
    } else if (filtro === 'filtroMarco') {
      const marcoValue = event.value;
      this.searchTerms.marco = marcoValue !== undefined ? marcoValue : undefined;
    } else if (filtro === 'filtroInstitucion') {
      const institucionValue = event.value;
      this.searchTerms.institucion = institucionValue !== undefined ? institucionValue : undefined;
    } else if (filtro === 'filtroCurso') {
      const cursoValue = event.value;
      this.searchTerms.curso = cursoValue !== undefined ? cursoValue : undefined;
    }
    this.talleres.filter = JSON.stringify(this.searchTerms);
    if (this.talleres.paginator) this.talleres.paginator.firstPage();
  }

  actualizarMensajes(filtroNombre: any, filtroEstado: any, filtroFrecuencia: any, filtroTurno: any, filtroDuracion: any, filtroDestinatarios: any, filtroEspecialidad: any, filtroConjuntoCon: any, filtroEsTaller: any, filtroMarco: any, filtroInstitucion: any, filtroCurso: any): void {
    this.mensajes = 'No se encontró un taller con:';
    if (filtroNombre) this.mensajes += ` Nombre: '${filtroNombre}'. `;
    if (filtroEstado) this.mensajes += ` Estado: ${filtroEstado ? 'Deshabilitado' : 'Habilitado'}.`;
    if (filtroFrecuencia) this.mensajes += ` Frecuencia: '${filtroFrecuencia}'. `;
    if (filtroDuracion) this.mensajes += ` Duracion: '${filtroDuracion}'. `;
    if (filtroEspecialidad) this.mensajes += ` Especialidad: '${filtroEspecialidad}'. `;
    if (filtroDestinatarios) this.mensajes += ` Destinatarios: '${filtroDestinatarios}'. `;
    if (filtroConjuntoCon) this.mensajes += ` Conjunto con: '${filtroConjuntoCon}'. `;
    if (filtroEsTaller) this.mensajes += ` Es Taller: '${filtroEsTaller ? 'Si' : 'No'}'. `;
    if (filtroMarco) this.mensajes += ` Marco: ${filtroMarco}`;
    if (filtroInstitucion) this.mensajes += ` Institucion: ${filtroInstitucion}`;
    if (filtroCurso) this.mensajes += ` Curso: ${filtroCurso}`;
    if (filtroTurno) this.mensajes += ` Turno: '${filtroTurno}'. `;
  }

  limpiarFiltro(filtroALimpiar: string) {
    this.searchTerms[filtroALimpiar] = undefined;
    this.talleres.filter = JSON.stringify(this.searchTerms);
    if (this.talleres.paginator) this.talleres.paginator.firstPage();
  }

  obtenerTalleres() {
    this.searching = true;
    this._tallerService.obtenerTalleres().subscribe({
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

  obtenerMarcos() {
    this.loadingMarcos = true;
    this._marcoService.obtenerMarcos().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.marcosOriginales = response.data;
          this.marcos = response.data;
        }
        this.loadingMarcos = false;
      },
      error: (err: any) => {
        MostrarNotificacion.mensajeErrorServicio(this.snackBar, err);
        this.loadingMarcos = false;
      },
    });
  }

  obtenerInstituciones() {
    this.loadingInstituciones = true;
    this._institucionService.obtenerInstituciones().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.instituciones = response.data;
        }
        this.loadingInstituciones = false;
      },
      error: (err: any) => {
        MostrarNotificacion.mensajeErrorServicio(this.snackBar, err);
        this.loadingInstituciones = false;
      },
    });
  }

  obtenerEspecialidades() {
    this.loadingEspecialidades = true;
    this._especialidadService.obtenerEspecialidades().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.especialidadesOriginales = response.data;
          this.especialidades = response.data;
        }
        this.loadingEspecialidades = false;
      },
      error: (err: any) => {
        MostrarNotificacion.mensajeErrorServicio(this.snackBar, err);
        this.loadingEspecialidades = false;
      },
    });
  }

  obtenerCursos() {
    this.loadingCursos = true;
    this._cursoService.obtenerCursos().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.cursos = response.data;
        }
        this.loadingCursos = false;
      },
      error: (err: any) => {
        MostrarNotificacion.mensajeErrorServicio(this.snackBar, err);
        this.loadingCursos = false;
      },
    });
  }

  onChangeEspecialidad() {
    const nombreSeleccionada = this.especialidadControl.value;
    const idEspecialidad = this.especialidades.find((e) => e.nombre === nombreSeleccionada)?.id;
    this.marcos = this.marcosOriginales.filter((m) => m.especialidad?.id === idEspecialidad);
  }

  limpiarMarcos() {
    this.limpiarFiltro('filtroMarco');
    this.limpiarFiltro('marco');
    this.marcos = this.marcosOriginales;
    this.marcoControl.setValue(null);
  }

  inhabilitar(id: number) {
    Swal.fire({
      title: '¿Eliminar taller?',
      text: 'El taller se borrara permantenmente.',
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

  verDetallesTaller(taller: Taller) {
    const dialogRef = this._dialog.open(VerTallerComponent, { panelClass: 'full-screen-dialog', data: { taller } });
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
