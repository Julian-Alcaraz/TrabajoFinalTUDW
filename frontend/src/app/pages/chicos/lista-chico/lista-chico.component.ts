import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DatePipe, CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProgressBarModule } from 'primeng/progressbar';
import { InputNumberModule } from 'primeng/inputnumber';
import { RouterModule, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Select, SelectModule } from 'primeng/select';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { MatSliderModule } from '@angular/material/slider';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { TagModule } from 'primeng/tag';
import Swal from 'sweetalert2';

import * as MostrarNotificacion from '../../../utils/notificaciones/mostrar-notificacion';
import { Chico } from '../../../models/chico.model';
import { ChicoService } from '../../../services/chico.service';
import { PaginadorPersonalizado } from '../../../utils/paginador/paginador-personalizado';
import { LoadingComponent } from '../../../components/loading/loading.component';
import { EditarChicoComponent } from '../editar-chico/editar-chico.component';
import { Barrio } from '../../../models/barrio.model';
import { BarrioService } from '../../../services/barrio.service';
import { SessionService } from '../../../services/session.service';
import { Usuario } from '../../../models/usuario.model';
import { LocalidadService } from '../../../services/localidad.service';
import { Localidad } from '../../../models/localidad.model';

@Component({
  selector: 'app-lista-chico',
  standalone: true,
  imports: [CommonModule, IconFieldModule, InputIconModule, MatSliderModule, SelectModule, InputTextModule, InputNumberModule, IftaLabelModule, MatTableModule, MatInputModule, MatFormFieldModule, MatPaginator, MatPaginatorModule, DatePipe, RouterModule, LoadingComponent, ProgressBarModule, TooltipModule, ReactiveFormsModule, MatSortModule, TagModule],
  templateUrl: './lista-chico.component.html',
  styleUrl: './lista-chico.component.css',
  providers: [{ provide: MatPaginatorIntl, useClass: PaginadorPersonalizado }],
})
export class ListaChicoComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginador: MatPaginator | null = null;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('filtroSexo') filtroSexo!: Select;
  @ViewChild('filtroBarrio') filtroBarrio!: Select;

  private _liveAnnouncer = inject(LiveAnnouncer);
  public chicos: MatTableDataSource<Chico>;
  public localidadesOriginales: Localidad[] | undefined = undefined;
  public localidadesFiltradas: Localidad[] | undefined = undefined;
  public barriosOriginales: Barrio[] | undefined = undefined;
  public barriosFiltrados: Barrio[] | undefined = undefined;
  public identidad: Usuario | null = null;
  public loadingLocalidades = false;
  public loadingBarrios = false;
  public searching = true;
  public resultsLength = 0;
  public searchTerms: any = {};
  public displayedColumns: string[] = ['numero', 'nombre', 'apellido', 'documento', 'fechaNac', 'sexo', 'direccion', 'telefono', 'consultasBar', 'action']; //'estado',
  public estadoOptions: any[] = [
    { nombre: 'Habilitado', valor: false },
    { nombre: 'Deshabilitado', valor: true },
  ];
  public actividadOptions: any[] = [
    { nombre: 'Ninguna especialidad visitada', valor: 0 },
    { nombre: '1 Especialidad visitada', valor: 1 },
    { nombre: '2 Especialidades visitadas', valor: 2 },
    { nombre: '3 Especialidades visitadas', valor: 3 },
    { nombre: '4 Especialidades visitadas', valor: 4 },
  ];
  public sexoOptions: any[] = [{ nombre: 'Masculino' }, { nombre: 'Femenino' }, { nombre: 'Otro' }];
  public estadoControl: FormControl = new FormControl(null);
  public localidadControl: FormControl = new FormControl(null);
  public sexoControl: FormControl = new FormControl(null);
  public barrioControl: FormControl = new FormControl(null);
  public actividadControl: FormControl = new FormControl();
  public mensajes = '';

  constructor(
    private _localidadService: LocalidadService,
    private _chicoService: ChicoService,
    private _barrioService: BarrioService,
    private _sessionService: SessionService,
    private _router: Router,
    private _dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {
    this.chicos = new MatTableDataSource<Chico>([]);
    this.chicos.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'estado':
          return item.deshabilitado ? 1 : 0;
        default:
          return item[property];
      }
    };
    this.identidad = this._sessionService.getIdentidad();
    if (this.identidad && this.identidad?.roles_ids) {
      if (!(this.identidad?.roles_ids.includes(1) || this.identidad?.roles_ids?.includes(2))) {
        this.displayedColumns.pop();
      }
    }
  }

  ngOnInit(): void {
    this.obtenerChicos();
    this.obtenerBarrios();
    this.obtenerLocalidades();
    this.activateTableFilter();
  }

  ngAfterViewInit() {
    this.chicos.paginator = this.paginador;
    this.chicos.sort = this.sort;
  }

  actualizarMensajes(filtroDni: any, filtroNombre: any, filtroApellido: any, filtroSexo: any, filtroBarrio: any, filtroActividad: any, filtroLocalidad: any, filtroEstado: any): void {
    const nombreBarrio = this.barriosFiltrados?.find((barrio) => barrio.id === filtroBarrio)?.nombre;
    const nombreLocalidad = this.localidadesFiltradas?.find((localidad) => localidad.id === filtroLocalidad)?.nombre;

    this.mensajes = 'No se encontró un chico con:';
    if (filtroDni) this.mensajes += ` DNI: ${filtroDni}. `;
    if (filtroNombre) this.mensajes += ` Nombre: '${filtroNombre}'. `;
    if (filtroApellido) this.mensajes += ` Apellido: '${filtroApellido}'. `;
    if (filtroSexo) this.mensajes += ` Sexo: ${filtroSexo}.`;
    if (filtroBarrio) this.mensajes += ` Barrio: ${nombreBarrio}.`;
    if (filtroActividad) this.mensajes += ` Actividad: ${filtroActividad}.`;
    if (filtroLocalidad) this.mensajes += ` Localidad: ${nombreLocalidad}.`;
    if (filtroEstado) this.mensajes += ` Estado: ${filtroEstado ? 'Deshabilitado' : 'Habilitado'}.`;
  }

  activateTableFilter() {
    // SE PODRIA CAMBIAR A Chico PERO DA ERROR DE TYPE
    this.chicos.filterPredicate = (chico: any, filter: string) => {
      const searchTerms = JSON.parse(filter);

      const matchesDni = searchTerms.dni ? String(chico.dni).startsWith(searchTerms.dni) : true;
      const matchesNombre = searchTerms.nombre ? sacarAcentos(chico.nombre.toLowerCase()).includes(searchTerms.nombre.toLowerCase()) : true;
      const matchesApellido = searchTerms.apellido ? sacarAcentos(chico.apellido.toLowerCase()).includes(searchTerms.apellido.toLowerCase()) : true;
      const matchesSexo = searchTerms.sexo ? String(chico.sexo) === searchTerms.sexo : true;
      const matchesBarrio = searchTerms.idBarrio ? chico.id_barrio === searchTerms.idBarrio : true;
      const matchesActividad = searchTerms.actividad !== undefined ? Number(chico.actividad) === Number(searchTerms.actividad) : true;
      const matchesLocalidad = searchTerms.idLocalidad ? chico.id_localidad === searchTerms.idLocalidad : true;
      const matchesEstado = searchTerms.estado !== undefined ? chico.deshabilitado === JSON.parse(searchTerms.estado) : true;

      this.actualizarMensajes(searchTerms.dni, searchTerms.nombre, searchTerms.apellido, searchTerms.sexo, searchTerms.idBarrio, searchTerms.actividad, searchTerms.idLocalidad, searchTerms.estado);
      return matchesDni && matchesNombre && matchesApellido && matchesSexo && matchesBarrio && matchesActividad && matchesLocalidad && matchesEstado;
    };
  }

  applyFilter(event: any) {
    let idInput = '';
    if (event.originalEvent) idInput = event.originalEvent.target.id;
    else if (event.target) idInput = event.target.id;
    else if (event.originalTarget.id) idInput = event.originalTarget.id;
    if (idInput === 'filtroDni') {
      const dniValue = event.target.value.replace(/[,.]/g, '');
      this.searchTerms.dni = dniValue;
    } else if (idInput === 'filtroNombre') {
      const nombreValue = sacarAcentos(event.target.value.trim().toLowerCase());
      this.searchTerms.nombre = nombreValue;
    } else if (idInput === 'filtroApellido') {
      const apellidoValue = sacarAcentos(event.target.value.trim().toLowerCase());
      this.searchTerms.apellido = apellidoValue;
    } else if (idInput.includes('filtroSexo')) {
      const sexoValue = event.value;
      this.searchTerms.sexo = sexoValue;
    } else if (idInput.includes('filtroBarrio')) {
      const barrioValue = event.value;
      this.searchTerms.idBarrio = barrioValue;
    } else if (idInput.includes('filtroActividad')) {
      const actividadValue = event.value;
      this.searchTerms.actividad = actividadValue;
    } else if (idInput.includes('filtroLocalidad')) {
      const localidadValue = event.value;
      this.searchTerms.idLocalidad = localidadValue;
    } else if (idInput.includes('filtroEstado')) {
      const estadoValue = event.value;
      this.searchTerms.estado = estadoValue !== undefined ? estadoValue : undefined;
    }
    this.chicos.filter = JSON.stringify(this.searchTerms);
    if (this.chicos.paginator) this.chicos.paginator.firstPage();
  }

  limpiarFiltroSexo() {
    this.searchTerms.sexo = undefined;
    this.chicos.filter = JSON.stringify(this.searchTerms);
    if (this.chicos.paginator) this.chicos.paginator.firstPage();
  }

  limpiarFiltroBarrio() {
    this.searchTerms.idBarrio = undefined;
    this.chicos.filter = JSON.stringify(this.searchTerms);
    if (this.chicos.paginator) this.chicos.paginator.firstPage();
  }

  limpiarFiltroLocalidad() {
    this.searchTerms.idLocalidad = undefined;
    this.chicos.filter = JSON.stringify(this.searchTerms);
    if (this.chicos.paginator) this.chicos.paginator.firstPage();
    this.barriosFiltrados = this.barriosOriginales;
  }

  limpiarFiltroEstado() {
    this.searchTerms.estado = undefined;
    this.chicos.filter = JSON.stringify(this.searchTerms);
    if (this.chicos.paginator) this.chicos.paginator.firstPage();
  }

  limpiarFiltroActividad() {
    this.searchTerms.actividad = undefined;
    this.chicos.filter = JSON.stringify(this.searchTerms);
    if (this.chicos.paginator) this.chicos.paginator.firstPage();
  }

  onChangeLocalidad() {
    // Verificacion por si el evento change se dispara al tocar la X de limpiar campo
    const idLocalidad = this.localidadControl.value;
    if (idLocalidad == null) {
      return;
    }
    this.barrioControl.reset();
    this.limpiarFiltroBarrio();
    this.barriosFiltrados = this.barriosOriginales?.filter((barrio) => barrio.localidad?.id === idLocalidad);
  }

  onChangeBarrio() {
    // Verificacion por si el evento change se dispara al tocar la X de limpiar campo
    const idBarrio = this.barrioControl.value;
    if (idBarrio == null) {
      return;
    }
    const idLocalidad = this.barriosFiltrados?.filter((barrio) => barrio.id === this.barrioControl.value)[0].localidad?.id;
    if (idLocalidad !== this.localidadControl.value) {
      this.localidadControl.setValue(idLocalidad);
    }
  }

  obtenerChicos() {
    this.searching = true;
    this._chicoService.obtenerChicos().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.chicos.data = response.data;
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

  obtenerBarrios() {
    this.loadingBarrios = true;
    this._barrioService.obtenerBarrios().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.barriosOriginales = response.data;
          this.barriosFiltrados = response.data;
          this.loadingBarrios = false;
        }
      },
      error: (err: any) => {
        MostrarNotificacion.mensajeErrorServicio(this.snackBar, err);
        this.loadingBarrios = false;
      },
    });
  }

  obtenerLocalidades() {
    this.loadingLocalidades = true;
    this._localidadService.obtenerLocalidades().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.localidadesOriginales = response.data;
          this.localidadesFiltradas = response.data;
          this.loadingLocalidades = false;
        }
      },
      error: (err: any) => {
        MostrarNotificacion.mensajeErrorServicio(this.snackBar, err);
        this.loadingLocalidades = false;
      },
    });
  }

  notificar(id: number) {
    Swal.fire({
      title: 'Error',
      text: 'Para poder ver sus consultas o editar los datos personales del chico, usted debe habilitar al chico',
      icon: 'warning',
      showDenyButton: true,
      confirmButtonColor: '#3f77b4',
      confirmButtonText: 'Habilitar chico',
      denyButtonText: 'Cancelar',
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.habilitar(id);
      }
    });
  }

  habilitar(id: number) {
    Swal.fire({
      title: '¿Habilitar chico?',
      showDenyButton: true,
      confirmButtonColor: '#3f77b4',
      confirmButtonText: 'Confirmar',
      denyButtonText: 'Cancelar',
    }).then((result: any) => {
      if (result.isConfirmed) {
        const edit = { deshabilitado: false };
        this.modificarChico(id, edit);
      }
    });
  }

  inhabilitar(id: number) {
    Swal.fire({
      title: '¿Deshabilitar chico?',
      showDenyButton: true,
      confirmButtonColor: '#3f77b4',
      confirmButtonText: 'Confirmar',
      denyButtonText: `Cancelar`,
    }).then((result: any) => {
      if (result.isConfirmed) {
        const edit = { deshabilitado: true };
        this.modificarChico(id, edit);
      }
    });
  }

  modificarChico(id: number, edit: any) {
    this._chicoService.modificarChico(id, edit).subscribe({
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

  announceSortChange(sortState: Sort) {
    if (sortState.direction) this._liveAnnouncer.announce(`Ordenado ${sortState.direction}`);
    else this._liveAnnouncer.announce('Orden eliminado');
  }

  applyFilterToAllRow(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.chicos.filter = filterValue.trim().toLowerCase();
  }

  editarChico(id: number) {
    const dialogRef = this._dialog.open(EditarChicoComponent, { panelClass: 'full-screen-dialog', data: { id } });
    dialogRef.afterClosed().subscribe((recargar) => {
      if (recargar) {
        this.obtenerChicos();
      }
    });
  }

  verDetallesChico(id: number) {
    this._router.navigate(['/layout/chicos/ver', id]);
  }
}

function sacarAcentos(text: string): string {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}
