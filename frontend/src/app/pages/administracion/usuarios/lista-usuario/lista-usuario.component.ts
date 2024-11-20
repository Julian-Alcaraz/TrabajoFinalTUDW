import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MultiSelectModule } from 'primeng/multiselect';
import Swal from 'sweetalert2';

import * as MostrarNotificacion from '../../../../utils/notificaciones/mostrar-notificacion';
import { UsuarioService } from '../../../../services/usuario.service';
import { Usuario } from '../../../../models/usuario.model';
import { PaginadorPersonalizado } from '../../../../utils/paginador/paginador-personalizado';
import { LoadingComponent } from '../../../../components/loading/loading.component';
import { RolesService } from '../../../../services/roles.service';
import { Rol } from '../../../../models/rol.model';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-lista-usuario',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatTableModule, ReactiveFormsModule, MultiSelectModule, MatTableModule, MatInputModule, MatFormFieldModule, MatPaginator, MatPaginatorModule, LoadingComponent],
  templateUrl: './lista-usuario.component.html',
  styleUrl: './lista-usuario.component.css',
  providers: [{ provide: MatPaginatorIntl, useClass: PaginadorPersonalizado }],
})
export class ListaUsuarioComponent implements OnInit, AfterViewInit {
  public usuarios: MatTableDataSource<Usuario>;
  @ViewChild(MatPaginator) paginador: MatPaginator | null = null;
  @ViewChild('rolesFormElement') rolesFormElement!: ElementRef<HTMLFormElement>;
  // @ViewChild(MatSort) sort: MatSort;

  public rolesOptions = [
    { id: 1, nombre: 'Admin' },
    { id: 2, nombre: 'Profesional' },
    { id: 3, nombre: 'Acceso Info' },
  ];

  tieneElRol(rolId: number, element: Usuario): boolean {
    return element?.roles?.some((selectedRol) => selectedRol.id === rolId) || false;
  }

  public rolesForm: FormGroup;
  public roles!: Rol[];
  public resultsLength = 0;
  public searching = false;

  displayedColumns: string[] = ['numero', 'nombre', 'apellido', 'fechaNac', 'documento', 'email', 'roles', 'habilitado', 'action'];
  constructor(
    private _usuarioService: UsuarioService,
    private _rolesService: RolesService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
  ) {
    this.usuarios = new MatTableDataSource<Usuario>([]);
    this.rolesForm = this.fb.group({
      roles: this.fb.array([]),
      id_usuario: [''],
    });
  }

  ngOnInit(): void {
    this.getUsuarios();
    this.getRoles();
  }

  getUsuarios() {
    this.searching = true;
    this._usuarioService.obtenerUsuarios().subscribe({
      next: (response: any) => {
        if (response.success) {
          console.log(response);
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

  getRoles() {
    this.searching = true;
    this._rolesService.obtenerRoles().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.roles = response.data;
        }
        this.searching = false;
      },
      error: (err: any) => {
        MostrarNotificacion.mensajeErrorServicio(this.snackBar, err);
        this.searching = false;
      },
    });
  }

  submitRolesForm(): void {
    if (this.rolesForm.valid) {
      this.rolesFormElement.nativeElement.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    }
  }

  cambiarRoles(idUsuario: number) {
    console.log(this.rolesForm.value);
    console.log(idUsuario);
    Swal.fire({
      title: '¿Confirmar cambios?',
      showDenyButton: true,
      confirmButtonColor: '#3f77b4',
      confirmButtonText: 'Confirmar',
      denyButtonText: `Cancelar`,
    }).then((result: any) => {
      if (result.isConfirmed) {
        //const edit = { deshabilitado: false };
        //this.modifcarUsuario(id, edit);
      }
    });
  }

  onCheckboxChange(e: any) {
    const rolesArray: FormArray = this.rolesForm.get('roles') as FormArray;
    if (e.target.checked) {
      rolesArray.push(this.fb.control(e.target.value));
    } else {
      const index = rolesArray.controls.findIndex((x) => x.value === e.target.value);
      rolesArray.removeAt(index);
    }
  }

  ngAfterViewInit() {
    this.usuarios.paginator = this.paginador;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.usuarios.filter = filterValue.trim().toLowerCase();
  }

  habilitar(id: number) {
    Swal.fire({
      title: '¿Habilitar usuario?',
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
      title: '¿Restablecer contraseña de  usuario?',
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
}
