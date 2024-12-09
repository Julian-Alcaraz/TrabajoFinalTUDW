import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { AfterViewInit, Component, ElementRef, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import * as MostrarNotificacion from '@utils/notificaciones/mostrar-notificacion';
import { UsuarioService } from '@services/usuario.service';
import { Usuario } from '@models/usuario.model';
import { PaginadorPersonalizado } from '@utils/paginador/paginador-personalizado';
import { LoadingComponent } from '@components/loading/loading.component';
import { Rol } from '@models/rol.model';
import { ModalUsuarioComponent } from '../modal-usuario/modal-usuario.component';
import { NuevoUsuarioComponent } from '../nuevo-usuario/nuevo-usuario.component';

@Component({
  selector: 'app-lista-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSortModule, TagModule, MatTableModule, MatPaginator, MatPaginatorModule, LoadingComponent, TooltipModule, IftaLabelModule, InputNumberModule, InputTextModule, SelectModule],
  templateUrl: './lista-usuario.component.html',
  providers: [{ provide: MatPaginatorIntl, useClass: PaginadorPersonalizado }],
})
export class ListaUsuarioComponent implements OnInit, AfterViewInit {
  private _liveAnnouncer = inject(LiveAnnouncer);

  public estadoControl: FormControl = new FormControl(null);
  public searchTerms: any = {};
  public mensajes = '';
  public usuarios: MatTableDataSource<Usuario>;
  public roles!: Rol[];
  public resultsLength = 0;
  public searching = false;

  public estadoOptions: any[] = [
    { nombre: 'Habilitado', valor: false },
    { nombre: 'Deshabilitado', valor: true },
  ];

  @ViewChild(MatPaginator) paginador: MatPaginator | null = null;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('rolesFormElement') rolesFormElement!: ElementRef<HTMLFormElement>;
  @ViewChild('nuevoUsuarioModal') nuevoUsuarioModal!: TemplateRef<any>;

  displayedColumns: string[] = ['numero', 'nombre', 'apellido', 'documento', 'fechaNac', 'email', 'roles', 'action']; //, 'estado'
  constructor(
    private snackBar: MatSnackBar,
    private _usuarioService: UsuarioService,
    private _dialog: MatDialog,
  ) {
    this.usuarios = new MatTableDataSource<Usuario>([]);
    this.usuarios.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'estado':
          return item.deshabilitado ? 1 : 0;
        default:
          return item[property];
      }
    };
  }

  ngOnInit(): void {
    this.obtenerUsuarios();
    this.activateTableFilter();
  }

  ngAfterViewInit() {
    this.usuarios.paginator = this.paginador;
    this.usuarios.sort = this.sort;
  }

  crearUsuario() {
    const modal = this._dialog.open(NuevoUsuarioComponent, { panelClass: 'full-screen-dialog' });
    modal.afterClosed().subscribe((actualizar) => {
      if (actualizar) {
        this.obtenerUsuarios();
      }
    });
  }

  obtenerUsuarios() {
    this.searching = true;
    this._usuarioService.obtenerUsuarios().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.usuarios.data = response.data;
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

  editarRoles(usuario: Usuario) {
    const modal = this._dialog.open(ModalUsuarioComponent, { panelClass: 'full-screen-dialog', data: { usuario } });
    modal.afterClosed().subscribe((actualizar) => {
      if (actualizar) {
        this.obtenerUsuarios();
      }
    });
  }

  activateTableFilter() {
    this.usuarios.filterPredicate = (chico: any, filter: string) => {
      const searchTerms = JSON.parse(filter);

      const matchesDni = searchTerms.dni ? String(chico.dni).startsWith(searchTerms.dni) : true;
      const matchesNombre = searchTerms.nombre ? sacarAcentos(chico.nombre.toLowerCase()).includes(searchTerms.nombre.toLowerCase()) : true;
      const matchesApellido = searchTerms.apellido ? sacarAcentos(chico.apellido.toLowerCase()).includes(searchTerms.apellido.toLowerCase()) : true;
      // const matchesSexo = searchTerms.sexo ? String(chico.sexo).startsWith(searchTerms.sexo) : true;
      // const matchesBarrio = searchTerms.idBarrio ? chico.id_barrio === searchTerms.idBarrio : true;
      // const matchesActividad = searchTerms.actividad !== undefined ? Number(chico.actividad) === Number(searchTerms.actividad) : true;
      // const matchesLocalidad = searchTerms.idLocalidad ? chico.id_localidad === searchTerms.idLocalidad : true;
      const matchesEstado = searchTerms.estado !== undefined ? chico.deshabilitado === JSON.parse(searchTerms.estado) : true;

      this.actualizarMensajes(searchTerms.dni, searchTerms.nombre, searchTerms.apellido, searchTerms.estado);
      return matchesDni && matchesNombre && matchesApellido && matchesEstado;
    };
  }

  actualizarMensajes(filtroDni: any, filtroNombre: any, filtroApellido: any, filtroEstado: any): void {
    this.mensajes = 'No se encontró un chico con:';
    if (filtroDni) this.mensajes += ` DNI: ${filtroDni}. `;
    if (filtroNombre) this.mensajes += ` Nombre: '${filtroNombre}'. `;
    if (filtroApellido) this.mensajes += ` Apellido: '${filtroApellido}'. `;
    if (filtroEstado) this.mensajes += ` Estado: ${filtroEstado ? 'Deshabilitado' : 'Habilitado'}.`;
  }

  applyFilter(event: any) {
    let idInput = '';
    if (event.originalEvent) idInput = event.originalEvent.target.id;
    else if (event.target) idInput = event.target.id;
    else if (event.originalTarget.id) idInput = event.originalTarget.id;
    if (idInput === 'filtroDni') {
      const dniValue = event.target.value.replace(/[,.]/g, '');
      this.searchTerms.dni = dniValue || undefined;
    } else if (idInput === 'filtroNombre') {
      const nombreValue = sacarAcentos(event.target.value.trim().toLowerCase());
      this.searchTerms.nombre = nombreValue || undefined;
    } else if (idInput === 'filtroApellido') {
      const apellidoValue = sacarAcentos(event.target.value.trim().toLowerCase());
      this.searchTerms.apellido = apellidoValue || undefined;
    } else if (idInput.includes('filtroEstado')) {
      const estadoValue = event.value;
      this.searchTerms.estado = estadoValue !== undefined ? estadoValue : undefined;
    }
    this.usuarios.filter = JSON.stringify(this.searchTerms);
    if (this.usuarios.paginator) this.usuarios.paginator.firstPage();
  }

  limpiarFiltroEstado() {
    this.searchTerms.estado = undefined;
    this.usuarios.filter = JSON.stringify(this.searchTerms);
    if (this.usuarios.paginator) this.usuarios.paginator.firstPage();
  }

  habilitar(id: number) {
    Swal.fire({
      title: '¿Habilitar usuario?',
      text: 'El usuario podrá iniciar sesión nuevamente con su cuenta.',
      showDenyButton: true,
      confirmButtonColor: '#3f77b4',
      confirmButtonText: 'Confirmar',
      denyButtonText: `Cancelar`,
    }).then((result: any) => {
      if (result.isConfirmed) {
        const edit = { deshabilitado: false };
        this.modifcarUsuario(id, edit);
      }
    });
  }

  inhabilitar(id: number) {
    Swal.fire({
      title: '¿Deshabilitar usuario?',
      text: 'El usuario no podrá iniciar sesión con su cuenta.',
      showDenyButton: true,
      confirmButtonColor: '#3f77b4',
      confirmButtonText: 'Confirmar',
      denyButtonText: `Cancelar`,
    }).then((result: any) => {
      if (result.isConfirmed) {
        const edit = { deshabilitado: true };
        this.modifcarUsuario(id, edit);
      }
    });
  }

  modifcarUsuario(id: number, edit: any) {
    this._usuarioService.modificarUsuario(id, edit).subscribe({
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

  resetarContrasenia(usuario: Usuario) {
    Swal.fire({
      title: '¿Restablecer la contraseña?',
      text: 'La contraseña del usuario se restablecerá a su DNI.',
      showDenyButton: true,
      confirmButtonColor: '#3f77b4',
      confirmButtonText: 'Confirmar',
      denyButtonText: `Cancelar`,
    }).then((result: any) => {
      if (result.isConfirmed) {
        const edit = { contrasenia: '' + usuario.dni };
        this.modifcarUsuario(usuario.id, edit);
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
