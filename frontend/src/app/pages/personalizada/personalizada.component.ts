import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabelModule } from 'primeng/floatlabel';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { IftaLabelModule } from 'primeng/iftalabel';

import * as MostrarNotificacion from '../../utils/notificaciones/mostrar-notificacion';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/usuario.service';
import { InstitucionService } from '../../services/institucion.service';
import { Institucion } from '../../models/institucion.model';
import { Curso } from '../../models/curso.model';
import { CursoService } from '../../services/curso.service';
import { CamposEspecificosComponent } from './campos-especificos/campos-especificos.component';
import { ConsultaService } from '../../services/consulta.service';

@Component({
  selector: 'app-personalizada',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DatePickerModule, FloatLabelModule, MultiSelectModule, SelectButtonModule, InputGroupModule, InputGroupAddonModule, InputNumberModule, SelectModule, ButtonModule, IftaLabelModule, CamposEspecificosComponent],
  templateUrl: './personalizada.component.html',
  styleUrl: './personalizada.component.css',
})
export class PersonalizadaComponent implements OnInit, AfterViewInit {
  public formBusqueda: FormGroup;
  public loading = false;
  public resultados: any;

  public hoy = new Date();

  public instituciones: Institucion[] = [];
  public cursos: Curso[] = [];
  public profesionales: Usuario[] = [];

  public tipoConsulta = ['Clinica', 'Oftalmologia', 'Odontologia', 'Fonoaudiologia'];
  public obraSocialOptions: any[] = [
    { nombre: 'Si', valor: true },
    { nombre: 'No', valor: false },
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

  // public rangoFechas: Date[] = [];

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private _cursoService: CursoService,
    private _institucionService: InstitucionService,
    private _usuarioService: UsuarioService,
    private _consultaService: ConsultaService,
  ) {
    this.formBusqueda = this.fb.group({
      generales: this.fb.group({
        chico: this.fb.group({
          sexo: [],
        }),
        institucion: this.fb.group({
          id: [],
        }),
        curso: this.fb.group({
          id: [],
        }),
        usuario: this.fb.group({
          id: [],
        }),
        edad: [],
        // rangoFechas: this.fb.control<Date[]>([]),
        rangoFechas: [],
        turno: [],
        obra_social: [],
      }),
      consultasSeleccionadas: [],
    });
  }

  ngOnInit(): void {
    //this.formBusqueda.addControl('rangoFechas', new FormControl(''));
    this.obtenerCursos();
    this.obtenerInstituciones();
    this.obtenerProfesionales();
    this.formBusqueda.get('consultasSeleccionadas')?.valueChanges.subscribe(() => {
      this.onChangeTipoConsulta();
    });
  }

  // NO SE USA!!!!
  ngAfterViewInit(): void {
    // Establecer el valor del rango de fechas aquí
    console.log(this.formBusqueda.get('generales.rangoFechas')?.value);
    this.formBusqueda.get('generales.rangoFechas')?.setValue([]);
    console.log(this.formBusqueda.get('generales.rangoFechas')?.value);
  }

  onChangeTipoConsulta() {
    this.formBusqueda.get('especificas')?.reset();
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

  // Tambien obtiene usuarios que tienen mas roles aparte del de profesional
  obtenerProfesionales(): any {
    this._usuarioService.obtenerProfesionales().subscribe({
      next: (response: any) => {
        this.profesionales = response.data;
      },
      error: (err: any) => {
        MostrarNotificacion.mensajeErrorServicio(this.snackBar, err);
      },
    });
  }

  buscar() {
    if (this.formBusqueda.valid) {
      this.loading = true;
      console.log(this.formBusqueda.value);
      const formValues = eliminarValoresNulosYVacios(this.formBusqueda.value);
      const derivaciones = {
        ...(formValues.derivaciones && formValues.derivaciones[0]?.Fonoaudiologia && { Fonoaudiologia: formValues.derivaciones[0].Fonoaudiologia }),
        ...(formValues.derivaciones && formValues.derivaciones[1]?.Odontologia && { Odontologia: formValues.derivaciones[1].Odontologia }),
        ...(formValues.derivaciones && formValues.derivaciones[2]?.Oftalmologia && { Oftalmologia: formValues.derivaciones[2].Oftalmologia }),
      };
      formValues.derivaciones = derivaciones;
      if (formValues.generales.rangoFechas && formValues.generales.rangoFechas.length === 0) delete formValues.generales.rangoFechas;
      if (formValues.derivaciones && Object.keys(formValues.derivaciones).length === 0) delete formValues.derivaciones;
      // var size = Object.keys(myObj).length;
      console.log('LA DATA ES ', formValues);
      console.log('---------');
      this._consultaService.busquedaPersonalizada(formValues).subscribe({
        next: (response: any) => {
          if (response.success) {
            MostrarNotificacion.mensajeExito(this.snackBar, response.message);
            this.resultados = response.data;
            console.log('Resultados backend', this.resultados);
            // this.formBusqueda.reset();
            this.loading = false;
          }
        },
        error: (err) => {
          MostrarNotificacion.mensajeErrorServicio(this.snackBar, err);
          this.loading = false;
        },
      });
    }
  }
}

function eliminarValoresNulosYVacios(obj: any): any {
  const cleanedObj: any = {};
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    // Si el valor es un objeto, llamamos recursivamente a la función
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      const nestedCleanedObj = eliminarValoresNulosYVacios(value);
      if (Object.keys(nestedCleanedObj).length > 0) {
        cleanedObj[key] = nestedCleanedObj;
      }
    }
    // Si el valor no es nulo, undefined o cadena vacía, lo añadimos
    else if (value !== null && value !== undefined && value !== '') {
      cleanedObj[key] = value;
    }
  });
  return cleanedObj;
}
