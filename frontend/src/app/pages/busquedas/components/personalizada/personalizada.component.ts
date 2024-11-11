import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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
import { KeyFilterModule } from 'primeng/keyfilter';

import * as MostrarNotificacion from '../../../../utils/notificaciones/mostrar-notificacion';
import { Usuario } from '../../../../models/usuario.model';
import { UsuarioService } from '../../../../services/usuario.service';
import { InstitucionService } from '../../../../services/institucion.service';
import { Institucion } from '../../../../models/institucion.model';
import { Curso } from '../../../../models/curso.model';
import { CursoService } from '../../../../services/curso.service';
import { CamposEspecificosComponent } from './campos-especificos/campos-especificos.component';
import { ConsultaService } from '../../../../services/consulta.service';
import { Consulta } from '../../../../models/consulta.model';

@Component({
  selector: 'app-personalizada',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DatePickerModule, FloatLabelModule, MultiSelectModule, SelectButtonModule, InputGroupModule, InputGroupAddonModule, InputNumberModule, SelectModule, ButtonModule, IftaLabelModule, CamposEspecificosComponent, KeyFilterModule],
  templateUrl: './personalizada.component.html',
  styleUrl: './personalizada.component.css',
})
export class PersonalizadaComponent implements OnInit {
  @Output() consultasEmitidas = new EventEmitter<Consulta[]>();
  public formBusqueda: FormGroup;
  public loading = false;
  public resultados: any;
  public hoy = new Date();
  public instituciones: Institucion[] = [];
  public cursos: Curso[] = [];
  public profesionales: Usuario[] = [];

  public tipoConsulta = ['Clinica', 'Oftalmologia', 'Odontologia', 'Fonoaudiologia'];
  public siNoOptions: any[] = [
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
        rangoFechas: [],
        turno: [],
        obra_social: [],
        observaciones: [],
      }),
      consultasSeleccionadas: [],
    });
  }

  ngOnInit(): void {
    this.hoy.setHours(23, 59, 59, 999);
    this.obtenerCursos();
    this.obtenerInstituciones();
    this.obtenerProfesionales();
    this.formBusqueda.get('consultasSeleccionadas')?.valueChanges.subscribe(() => {
      this.onChangeTipoConsulta();
    });
    this.formBusqueda.get('generales.rangoFechas')?.valueChanges.subscribe(() => {
      this.agregarHora(this.formBusqueda.get('generales.rangoFechas')?.value);
    });
  }

  agregarHora(rangoFechas: Date[]) {
    if (rangoFechas?.length === 2 && rangoFechas[1]) {
      const fechaInicio = new Date(rangoFechas[0]);
      const fechaFin = new Date(rangoFechas[1]);
      fechaFin.setHours(23, 59, 59, 999);
      this.formBusqueda.get('generales.rangoFechas')?.setValue([fechaInicio, fechaFin], { emitEvent: false });
    }
  }

  enviarConsultas(data: Consulta[]) {
    this.consultasEmitidas.emit(data);
  }
  onChangeTipoConsulta() {
    this.formBusqueda.get('especificas')?.reset();
    this.formBusqueda.get('derivaciones')?.reset();
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
      console.log('DATA: ', this.formBusqueda.value);
      const data = this.formBusqueda.value;
      const derivaciones = data.derivaciones?.reduce((acc: any, item: any) => {
        // FUNCIONA PERO COMPARA TODO.
        acc.odontologia = acc.odontologia || item.odontologia || false;
        acc.oftalmologia = acc.oftalmologia || item.oftalmologia || false;
        acc.fonoaudiologia = acc.fonoaudiologia || item.fonoaudiologia || false;
        acc.externa = acc.externa || item.externa || false;

        // Solo si no se selecciona clinica se incluye externa!!!!!!!!!!!!!
        // if (!formValues.consultasSeleccionadas?.includes('Clinica')) {
        //   acc.Externa = acc.Externa || item.Externa || false;
        // }
        return acc;
      }, {});
      // OTRO INTENTO:
      /*
      const derivaciones2 = data.derivaciones?.reduce((acc: any, item: any) => {
        // Inicializamos `acc` como un objeto vacío si es la primera iteración
        acc = acc || {};
        // Solo agregamos al acumulador las propiedades con valor `true`
        if (item.odontologia) {
          acc.odontologia = true;
        }
        if (item.oftalmologia) {
          acc.oftalmologia = true;
        }
        if (item.fonoaudiologia) {
          acc.fonoaudiologia = true;
        }
        if (item.externa) {
          acc.externa = true;
        }

        return acc;
      }, {}); // Inicializamos `acc` como un objeto vacío al comienzo
      */

      if (data.derivaciones) {
        console.log('if');
        data.generales.derivaciones = derivaciones;
        delete data.derivaciones;
      }
      console.log('Derivaciones:');
      console.log(derivaciones);
      console.log('---------');
      const formValues = eliminarValoresNulosYVacios(this.formBusqueda.value);
      //const formValues = this.formBusqueda.value;

      /*
      if (formValues.derivaciones) {
        formValues.generales.derivaciones = derivaciones;
        delete formValues.derivaciones;
      }
      */

      if (formValues.generales) {
        if (formValues.generales.rangoFechas && formValues.generales.rangoFechas.length === 0) {
          delete formValues.generales.rangoFechas;
        }
      }
      // Probar este if depsyues!!!!!!!
      if (formValues.derivaciones && Object.keys(formValues.derivaciones).length === 0) delete formValues.derivaciones;

      console.log('---------');
      console.log('LA DATA ENVIADA ES ', formValues);
      console.log('---------');

      this._consultaService.busquedaPersonalizada(formValues).subscribe({
        next: (response: any) => {
          if (response.success) {
            MostrarNotificacion.mensajeExito(this.snackBar, response.message);
            this.resultados = response.data;
            console.log('Resultados backend', this.resultados);
            this.enviarConsultas(response.data);
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
