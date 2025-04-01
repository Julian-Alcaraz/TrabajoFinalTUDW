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
import { PanelModule } from 'primeng/panel';

import * as MostrarNotificacion from '../../../../utils/notificaciones/mostrar-notificacion';
import { Usuario } from '../../../../models/usuario.model';
import { UsuarioService } from '../../../../services/usuario.service';
import { InstitucionService } from '../../../../services/institucion.service';
import { Institucion } from '../../../../models/institucion.model';
import { Curso } from '../../../../models/curso.model';
import { CursoService } from '../../../../services/curso.service';
import { ConsultaService } from '../../../../services/consulta.service';
import { Consulta } from '../../../../models/consulta.model';
import { CamposClinicaComponent } from './components/campos-clinica/campos-clinica.component';
import { CamposOftalmologiaComponent } from './components/campos-oftalmologia/campos-oftalmologia.component';
import { CamposFonoaudiologiaComponent } from './components/campos-fonoaudiologia/campos-fonoaudiologia.component';
import { CamposOdontologiaComponent } from './components/campos-odontologia/campos-odontologia.component';
import { XlsxService } from '../../../../services/excelJS.service';
import { LoadingComponent } from '../../../../components/loading/loading.component';
import { from } from 'rxjs';

@Component({
  selector: 'app-personalizada',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoadingComponent, DatePickerModule, FloatLabelModule, MultiSelectModule, SelectButtonModule, InputGroupModule, InputGroupAddonModule, InputNumberModule, SelectModule, ButtonModule, IftaLabelModule, KeyFilterModule, CamposClinicaComponent, CamposOftalmologiaComponent, CamposFonoaudiologiaComponent, CamposOdontologiaComponent, PanelModule],
  templateUrl: './personalizada.component.html',
})
export class PersonalizadaComponent implements OnInit {
  @Output() consultasEmitidas = new EventEmitter<Consulta[]>();

  public loadingCursos = false;
  public loadingInstituciones = false;
  public loadingProfesionales = false;
  public loading = false;
  public mostrarBotonDescarga = false;
  public generandoArchivo = false; // Aca faltaria usar esto para un spinner!!!
  public estaColapsadoComunes = false;
  public estaColapsadoEspecificos = false;
  public colapsarPaneles = false;
  public formBusqueda: FormGroup;
  public resultados: any;
  public hoy = new Date();
  public instituciones: Institucion[] = [];
  public cursos: Curso[] = [];
  public profesionales: Usuario[] = [];
  public searching = false;
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
  public sexoOptions: any[] = [{ nombre: 'Masculino' }, { nombre: 'Femenino' }, { nombre: 'Otro' }];

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private _cursoService: CursoService,
    private _institucionService: InstitucionService,
    private _usuarioService: UsuarioService,
    private _consultaService: ConsultaService,
    private _xlsxService: XlsxService,
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
    this.formBusqueda.valueChanges.subscribe(() => {
      this.mostrarBotonDescarga = false;
    });
  }

  enviarConsultas(data: Consulta[]) {
    this.consultasEmitidas.emit(data);
  }

  onChangeTipoConsulta() {
    this.formBusqueda.removeControl('especificas');
    if (this.formBusqueda.get('consultasSeleccionadas')?.value && this.formBusqueda.get('consultasSeleccionadas')?.value.length === 0) {
      this.formBusqueda.get('consultasSeleccionadas')?.reset();
    }
  }

  obtenerCursos(): any {
    this.loadingCursos = true;
    this._cursoService.obtenerCursos().subscribe({
      next: (response: any) => {
        this.cursos = response.data;
        this.loadingCursos = false;
      },
      error: (err: any) => {
        MostrarNotificacion.mensajeErrorServicio(this.snackBar, err);
        this.loadingCursos = false;
      },
    });
  }

  obtenerInstituciones(): any {
    this.loadingInstituciones = true;
    this._institucionService.obtenerInstituciones().subscribe({
      next: (response: any) => {
        this.instituciones = response.data;
        this.loadingInstituciones = false;
      },
      error: (err: any) => {
        MostrarNotificacion.mensajeErrorServicio(this.snackBar, err);
        this.loadingInstituciones = false;
      },
    });
  }

  // Tambien obtiene usuarios que tienen mas roles aparte del de profesional
  obtenerProfesionales(): any {
    this.loadingProfesionales = true;
    this._usuarioService.obtenerProfesionales().subscribe({
      next: (response: any) => {
        this.profesionales = response.data;
        this.loadingProfesionales = false;
      },
      error: (err: any) => {
        MostrarNotificacion.mensajeErrorServicio(this.snackBar, err);
        this.loadingProfesionales = false;
      },
    });
  }

  buscar() {
    this.colapsarPaneles = false;
    this.estaColapsadoComunes = true;
    this.estaColapsadoEspecificos = true;
    this.searching = true;
    if (this.formBusqueda.valid) {
      this.loading = true;
      this.colapsarPaneles = true;
      const resultado = prepararData(this.formBusqueda.value);
      const dataLimpia = eliminarValoresNulosYVacios(resultado);
      this._consultaService.busquedaPersonalizada(dataLimpia).subscribe({
        next: (response: any) => {
          if (response.success) {
            MostrarNotificacion.mensajeExito(this.snackBar, response.message);
            this.resultados = response.data;
            this.searching = false;
            this.enviarConsultas(response.data);
            this.mostrarBotonDescarga = true;
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

  limpiarFormGenerales() {
    this.formBusqueda.reset();
  }

  limpiarFormsEspecificos() {
    if (this.formBusqueda.get('especificas')?.value !== null) {
      this.formBusqueda.get('especificas')?.reset();
    }
  }

  exportarXLS() {
    this.generandoArchivo = true;
    setTimeout(() => {
      from(this._xlsxService.generarXlsx(this.resultados)).subscribe({
        next: (response: any) => {
          if (response.success) {
            MostrarNotificacion.mensajeExito(this.snackBar, response.message);
            this.generandoArchivo = false;
          }
        },
        error: (err) => {
          MostrarNotificacion.mensajeErrorServicio(this.snackBar, err);
          this.generandoArchivo = false;
        },
      });
    }, 100);
  }
}

function prepararData(data: any): any {
  if ((data.derivaciones !== '' && data.derivaciones) || (data.especificas?.derivaciones !== '' && data.especificas?.derivaciones)) {
    let derivacion_odontologia, derivacion_oftalmologia, derivacion_fonoaudiologia, derivacion_externa;
    for (const der of data.especificas.derivaciones) {
      if (der.fonoaudiologia) {
        derivacion_fonoaudiologia = der.fonoaudiologia;
        console.log('fonoaudiologia', derivacion_fonoaudiologia);
      }
      if (der.odontologia) {
        derivacion_odontologia = der.odontologia;
        console.log('odontologia', derivacion_odontologia);
      }
      if (der.oftalmologia) {
        derivacion_oftalmologia = der.oftalmologia;
        console.log('oftalmologia', derivacion_oftalmologia);
      }
      if (der.externa) {
        derivacion_externa = der.externa;
        console.log('externa', derivacion_externa);
      }
    }

    data.generales.derivacion_odontologia = derivacion_odontologia;
    data.generales.derivacion_oftalmologia = derivacion_oftalmologia;
    data.generales.derivacion_fonoaudiologia = derivacion_fonoaudiologia;
    data.generales.derivacion_externa = derivacion_externa;

    delete data.especificas.derivaciones;
  }
  if (data.generales.rangoFechas) {
    const fechaFin = new Date(data.generales.rangoFechas[1]);
    fechaFin.setHours(23, 59, 59, 999);
    data.generales.rangoFechas[1] = fechaFin;
  }
  return data;
}

function eliminarValoresNulosYVacios(obj: any): any {
  const cleanedObj: any = {};
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      const nestedCleanedObj = eliminarValoresNulosYVacios(value);
      if (Object.keys(nestedCleanedObj).length > 0) {
        cleanedObj[key] = nestedCleanedObj;
      }
    } else if (value !== null && value !== undefined && value !== '') {
      cleanedObj[key] = value;
    }
  });
  return cleanedObj;
}
