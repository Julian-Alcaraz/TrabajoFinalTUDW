import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { UsuarioService } from '../../../services/usuario.service';
import * as MostrarNotificacion from '../../../utils/notificaciones/mostrar-notificacion';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Usuario } from '../../../models/usuario.model';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { PaginadorPersonalizado } from '../../../utils/paginador/paginador-personalizado';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-lista-usuario',
  standalone: true,
  imports: [MatTableModule, MatInputModule, MatFormFieldModule, MatPaginator, MatPaginatorModule, DatePipe],
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

  displayedColumns: string[] = ['nombre', 'apellido', 'fechaNac', 'documento', 'email', 'habilitado', 'action'];
  constructor(
    private _usuarioService: UsuarioService,
    private snackBar: MatSnackBar,
  ) {
    this.usuarios = new MatTableDataSource<Usuario>([]);
  }
  ngOnInit(): void {
    this._usuarioService.obtenerUsuarios().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.usuarios.data = response.data;
          this.resultsLength = response.data.length;
        }
      },
      error: (err: any) => {
        MostrarNotificacion.mensajeErrorServicio(this.snackBar, err);
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
  resetarContrasenia(usuario:Usuario){
    Swal.fire({
      title: '¿Restablecer contraseña de  usuario?',
      showDenyButton: true,
      confirmButtonColor: '#3f77b4',
      confirmButtonText: 'Confirmar',
      denyButtonText: `Cancelar`,
    }).then((result: any) => {
      if (result.isConfirmed) {
        const edit = { contrasenia: ""+usuario.dni };
        this.modifcarUsuario(usuario.id, edit);
      }
    });
  }
}
