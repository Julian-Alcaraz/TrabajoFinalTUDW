import { IftaLabelModule } from 'primeng/iftalabel';
import { DatePipe, CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import { ProgressBarModule } from 'primeng/progressbar';
import * as MostrarNotificacion from '../../../utils/notificaciones/mostrar-notificacion';
import { Chico } from '../../../models/chico.model';
import { ChicoService } from '../../../services/chico.service';
import { PaginadorPersonalizado } from '../../../utils/paginador/paginador-personalizado';
import { RouterModule, Router } from '@angular/router';
import { LoadingComponent } from '../../../components/loading/loading.component';
import { TooltipModule } from 'primeng/tooltip';
import { EditarChicoComponent } from '../editar-chico/editar-chico.component';
import { MatDialog } from '@angular/material/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { Select, SelectModule } from 'primeng/select';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-lista-chico',
  standalone: true,
  imports: [CommonModule, SelectModule, InputTextModule, InputNumberModule, IftaLabelModule, MatTableModule, MatInputModule, MatFormFieldModule, MatPaginator, MatPaginatorModule, DatePipe, RouterModule, LoadingComponent, ProgressBarModule, TooltipModule, ReactiveFormsModule],
  templateUrl: './lista-chico.component.html',
  styleUrl: './lista-chico.component.css',
  providers: [{ provide: MatPaginatorIntl, useClass: PaginadorPersonalizado }],
})
export class ListaChicoComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginador: MatPaginator | null = null;
  @ViewChild('filtroSexo') filtroSexo!: Select;
  public chicos: MatTableDataSource<Chico>;
  public resultsLength = 0;
  public searching = true;
  public displayedColumns: string[] = ['numero', 'nombre', 'apellido', 'documento', 'fechaNac', 'sexo', 'direccion', 'telefono', 'consultasBar', 'action'];
  public searchTerms: any = {};
  public sexoOptions: any[] = [{ nombre: 'Masculino' }, { nombre: 'Femenino' }, { nombre: 'Otro' }];
  public sexoControl: FormControl = new FormControl(null);
  constructor(
    private _chicoService: ChicoService,
    private _router: Router,
    private snackBar: MatSnackBar,
    private _dialog: MatDialog,
  ) {
    this.chicos = new MatTableDataSource<Chico>([]);
  }

  ngOnInit(): void {
    this.getChicos();
    this.activateTableFilter();
  }

  ngAfterViewInit() {
    this.chicos.paginator = this.paginador;
  }

  getChicos() {
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

  activateTableFilter() {
    this.chicos.filterPredicate = (data: Chico, filter: string) => {
      const searchTerms = JSON.parse(filter); // Parsear los términos de búsqueda
      // Verificar si cada término coincide con los datos
      const matchesDni = searchTerms.dni ? String(data.dni).startsWith(searchTerms.dni) : true;
      const matchesNombre = searchTerms.nombre ? data.nombre.toLowerCase().includes(searchTerms.nombre.toLowerCase()) : true;
      const matchesApellido = searchTerms.apellido ? data.apellido.toLowerCase().includes(searchTerms.apellido.toLowerCase()) : true;
      const matchesSexo = searchTerms.sexo ? String(data.sexo).startsWith(searchTerms.sexo) : true;
      // Retornar true si todos los términos coinciden
      return matchesDni && matchesNombre && matchesApellido && matchesSexo;
    };
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
    } else if (idInput === '' && !event.value) {
      this.searchTerms.sexo = undefined;
    }
    this.chicos.filter = JSON.stringify(this.searchTerms);
    if (this.chicos.paginator) {
      this.chicos.paginator.firstPage();
    }
  }

  editarChico(id: number) {
    this._dialog.open(EditarChicoComponent, { panelClass: 'full-screen-dialog', data: { id } });
  }

  verDetallesChico(id: number) {
    this._router.navigate(['/layout/chicos/ver', id]);
  }
}
