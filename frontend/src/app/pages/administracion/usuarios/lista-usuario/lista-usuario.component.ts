import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { AfterViewInit, Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { TagModule } from 'primeng/tag';

import * as MostrarNotificacion from '../../../../utils/notificaciones/mostrar-notificacion';
import { UsuarioService } from '../../../../services/usuario.service';
import { Usuario } from '../../../../models/usuario.model';
import { PaginadorPersonalizado } from '../../../../utils/paginador/paginador-personalizado';
import { LoadingComponent } from '../../../../components/loading/loading.component';
import { Rol } from '../../../../models/rol.model';
import { ModalUsuarioComponent } from '../modal-usuario/modal-usuario.component';
import { NuevoUsuarioComponent } from '../nuevo-usuario/nuevo-usuario.component';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-lista-usuario',
  standalone: true,
  imports: [CommonModule, TagModule, MatTableModule, MatPaginator, MatPaginatorModule, LoadingComponent, TooltipModule],
  templateUrl: './lista-usuario.component.html',
  styleUrl: './lista-usuario.component.css',
  providers: [{ provide: MatPaginatorIntl, useClass: PaginadorPersonalizado }],
})
export class ListaUsuarioComponent implements OnInit, AfterViewInit {
  public usuarios: MatTableDataSource<Usuario>;
  public roles!: Rol[];
  public resultsLength = 0;
  public searching = false;

  @ViewChild(MatPaginator) paginador: MatPaginator | null = null;
  @ViewChild('rolesFormElement') rolesFormElement!: ElementRef<HTMLFormElement>;
  @ViewChild('nuevoUsuarioModal') nuevoUsuarioModal!: TemplateRef<any>;

  displayedColumns: string[] = ['numero', 'nombre', 'apellido', 'documento', 'fechaNac', 'email', 'roles', 'habilitado', 'action'];
  constructor(
    private snackBar: MatSnackBar,
    private _usuarioService: UsuarioService,
    private _dialog: MatDialog,
  ) {
    this.usuarios = new MatTableDataSource<Usuario>([]);
  }

  ngOnInit(): void {
    this.obtenerUsuarios();
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

  editarRoles(usuario: Usuario) {
    const modal = this._dialog.open(ModalUsuarioComponent, { panelClass: 'full-screen-dialog', data: { usuario } });
    modal.afterClosed().subscribe((actualizar) => {
      if (actualizar) {
        this.obtenerUsuarios();
      }
    });
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
}
