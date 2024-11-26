import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
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
import Swal from 'sweetalert2';
import { SliderModule } from 'primeng/slider';

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

@Component({
  selector: 'app-lista-chico',
  standalone: true,
  imports: [CommonModule, SliderModule, SelectModule, InputTextModule, InputNumberModule, IftaLabelModule, MatTableModule, MatInputModule, MatFormFieldModule, MatPaginator, MatPaginatorModule, DatePipe, RouterModule, LoadingComponent, ProgressBarModule, TooltipModule, ReactiveFormsModule],
  templateUrl: './lista-chico.component.html',
  styleUrl: './lista-chico.component.css',
  providers: [{ provide: MatPaginatorIntl, useClass: PaginadorPersonalizado }],
})
export class ListaChicoComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginador: MatPaginator | null = null;
  @ViewChild('filtroSexo') filtroSexo!: Select;
  @ViewChild('filtroBarrio') filtroBarrio!: Select;
  public chicos: MatTableDataSource<Chico>;
  public resultsLength = 0;
  public searching = true;
  public displayedColumns: string[] = ['numero', 'nombre', 'apellido', 'documento', 'fechaNac', 'sexo', 'direccion', 'telefono', 'consultasBar', 'action'];
  public searchTerms: any = {};
  public sexoOptions: any[] = [{ nombre: 'Masculino' }, { nombre: 'Femenino' }, { nombre: 'Otro' }];
  public sexoControl: FormControl = new FormControl(null);
  public barrioControl: FormControl = new FormControl(null);
  // public actividadControl: FormControl = new FormControl();
  public mensajes = '';
  public barrios: Barrio[] | undefined = undefined;
  public identidad: Usuario |null=null;
  constructor(
    private _chicoService: ChicoService,
    private _barrioService: BarrioService,
    private _sessionService: SessionService,
    private _router: Router,
    private _dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {
    this.chicos = new MatTableDataSource<Chico>([]);
    this.identidad = this._sessionService.getIdentidad();
    if (this.identidad && this.identidad?.roles_ids) {
      if ( !(this.identidad?.roles_ids.includes(1) || this.identidad?.roles_ids?.includes(2))) {
        this.displayedColumns.pop()
      }
    }
  }

  ngOnInit(): void {
    this.obtenerChicos();
    this.obtenerBarrios();
    this.activateTableFilter();
  }

  actualizarMensajes(filtroDni: any, filtroNombre: any, filtroApellido: any, filtroSexo: any, filtroBarrio: any): void {
    this.mensajes = 'No se encontró un chico con: ';
    if (filtroDni) this.mensajes += `DNI: ${filtroDni}. `;
    if (filtroNombre) this.mensajes += `Nombre: '${filtroNombre}'. `;
    if (filtroApellido) this.mensajes += `Apellido: '${filtroApellido}'. `;
    if (filtroSexo) this.mensajes += `Sexo: ${filtroSexo}.`;
    if (filtroBarrio) this.mensajes += `Barrio: ${filtroBarrio}.`;
  }

  activateTableFilter() {
    this.chicos.filterPredicate = (chico: Chico, filter: string) => {
      const searchTerms = JSON.parse(filter);

      const matchesDni = searchTerms.dni ? String(chico.dni).startsWith(searchTerms.dni) : true;
      const matchesNombre = searchTerms.nombre ? chico.nombre.toLowerCase().includes(searchTerms.nombre.toLowerCase()) : true;
      const matchesApellido = searchTerms.apellido ? chico.apellido.toLowerCase().includes(searchTerms.apellido.toLowerCase()) : true;
      const matchesSexo = searchTerms.sexo ? String(chico.sexo).startsWith(searchTerms.sexo) : true;
      const matchesBarrio = searchTerms.nombreBarrio ? String(chico.barrio?.nombre).startsWith(searchTerms.nombreBarrio) : true;

      this.actualizarMensajes(searchTerms.dni, searchTerms.nombre, searchTerms.apellido, searchTerms.sexo, searchTerms.nombreBarrio);
      return matchesDni && matchesNombre && matchesApellido && matchesSexo && matchesBarrio;
    };
  }

  applyFilter(event: any) {
    let idInput = '';
    if (event.originalEvent) idInput = event.originalEvent.target.id;
    else if (event.target) idInput = event.target.id;
    if (idInput === 'filtroDni') {
      const dniValue = event.target.value.replace(/,/g, ''); // Elimina comas
      this.searchTerms.dni = dniValue || undefined;
    } else if (idInput === 'filtroNombre') {
      const nombreValue = event.target.value.trim();
      this.searchTerms.nombre = nombreValue || undefined;
    } else if (idInput === 'filtroApellido') {
      const apellidoValue = event.target.value.trim();
      this.searchTerms.apellido = apellidoValue || undefined;
    } else if (idInput.includes('filtroSexo')) {
      const sexoValue = event.value;
      this.searchTerms.sexo = sexoValue || undefined;
    } else if (idInput.includes('filtroBarrio')) {
      const barrioValue = event.value;
      this.searchTerms.nombreBarrio = barrioValue || undefined;
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
    this.searchTerms.nombreBarrio = undefined;
    this.chicos.filter = JSON.stringify(this.searchTerms);
    if (this.chicos.paginator) this.chicos.paginator.firstPage();
  }

  ngAfterViewInit() {
    this.chicos.paginator = this.paginador;
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
    this._barrioService.obtenerBarrios().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.barrios = response.data;
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

  applyFilterToAllRow(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.chicos.filter = filterValue.trim().toLowerCase();
  }

  editarChico(id: number) {
    this._dialog.open(EditarChicoComponent, { panelClass: 'full-screen-dialog', data: { id } });
  }

  verDetallesChico(id: number) {
    this._router.navigate(['/layout/chicos/ver', id]);
  }
}
