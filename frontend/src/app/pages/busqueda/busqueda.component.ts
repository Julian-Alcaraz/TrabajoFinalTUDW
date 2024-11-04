import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';

import * as MostrarNotificacion from '../../utils/notificaciones/mostrar-notificacion';
import { CursoService } from '../../services/curso.service';
import { InstitucionService } from '../../services/institucion.service';
import { Institucion } from '../../models/institucion.model';
import { Curso } from '../../models/curso.model';

@Component({
  selector: 'app-busqueda',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DatePickerModule, FloatLabelModule, MultiSelectModule, SelectButtonModule, InputGroupModule, InputGroupAddonModule, InputNumberModule, SelectModule, ButtonModule],
  templateUrl: './busqueda.component.html',
  styleUrl: './busqueda.component.css',
})
export class BusquedaComponent implements OnInit {
  public formBusqueda: FormGroup;
  public loading = false;

  public instituciones: Institucion[] = [];
  public cursos: Curso[] = [];

  public tipoConsulta = [
    { name: 'Clinica', code: 'NY' },
    { name: 'Oftalmologia', code: 'RM' },
    { name: 'Odontologia', code: 'LDN' },
    { name: 'Fonoaudiologia', code: 'IST' },
  ];

  public obraSocialOptions: any[] = [
    { nombre: 'Si', valor: 'true' },
    { nombre: 'No', valor: 'false' },
  ];

  public turnoOptions: any[] = [
    { nombre: 'Mañana', valor: 'Mañana' },
    { nombre: 'Tarde', valor: 'Tarde' },
    { nombre: 'Noche', valor: 'Noche' },
  ];

  public sexoOptions: any[] = [
    { nombre: 'M', valor: 'Masculino' },
    { nombre: 'F', valor: 'Femenino' },
  ];

  constructor(
    private fb: FormBuilder,
    private _cursoService: CursoService,
    private _institucionService: InstitucionService,
    private snackBar: MatSnackBar,
  ) {
    this.formBusqueda = this.fb.group({
      rangoFechas: [''],
      consultasSeleccionadas: [''],
      obra_social: [''],
      turno: [''],
      sexo: [''],
      edad: [''],
      cursoSeleccionado: [''],
    });
  }

  ngOnInit(): void {
    console.log('init busqueda');
    this.obtenerCursos();
    this.obtenerInstituciones();
  }

  obtenerCursos(): any {
    this._cursoService.obtenerCursos().subscribe({
      next: (response: any) => {
        this.cursos = response.data;
      },
      error: (err: any) => {
        MostrarNotificacion.mensajeErrorServicio(this.snackBar, err);
      },
    });
  }

  obtenerInstituciones(): any {
    this._institucionService.obtenerInstituciones().subscribe({
      next: (response: any) => {
        this.instituciones = response.data;
      },
      error: (err: any) => {
        MostrarNotificacion.mensajeErrorServicio(this.snackBar, err);
      },
    });
  }

  buscar() {
    this.loading = true;

    setTimeout(() => {
      this.loading = false;
    }, 2000);
  }
}
