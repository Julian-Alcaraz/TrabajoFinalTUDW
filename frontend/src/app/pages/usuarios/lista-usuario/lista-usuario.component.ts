import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import Swal from 'sweetalert2';

import * as MostrarNotificacion from '../../../utils/notificaciones/mostrar-notificacion';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../models/usuario.model';
import { PaginadorPersonalizado } from '../../../utils/paginador/paginador-personalizado';
import { LoadingComponent } from '../../../components/loading/loading.component';

@Component({
  selector: 'app-lista-usuario',
  standalone: true,
  imports: [MatTableModule, MatInputModule, MatFormFieldModule, MatPaginator, MatPaginatorModule, LoadingComponent],
  templateUrl: './lista-usuario.component.html',
  styleUrl: './lista-usuario.component.css',
  providers: [{ provide: MatPaginatorIntl, useClass: PaginadorPersonalizado }],
})
export class ListaUsuarioComponent implements OnInit, AfterViewInit {
  public usuarios: MatTableDataSource<Usuario>;
  @ViewChild(MatPaginator) paginador: MatPaginator | null = null;
  // @ViewChild(MatSort) sort: MatSort;

  public resultsLength = 0;
  public searching = false;

  displayedColumns: string[] = ['numero', 'nombre', 'apellido', 'fechaNac', 'documento', 'email', 'habilitado', 'action'];
  constructor(
    private _usuarioService: UsuarioService,
    private snackBar: MatSnackBar,
  ) {
    this.usuarios = new MatTableDataSource<Usuario>([]);
  }
  ngOnInit(): void {
    this.getUsuarios();
  }
  getUsuarios() {
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
