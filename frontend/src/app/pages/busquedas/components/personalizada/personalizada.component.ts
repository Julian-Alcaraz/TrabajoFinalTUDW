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
import { CsvService } from '../../../../services/csv.service';
import { LoadingComponent } from '../../../../components/loading/loading.component';

@Component({
  selector: 'app-personalizada',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoadingComponent, DatePickerModule, FloatLabelModule, MultiSelectModule, SelectButtonModule, InputGroupModule, InputGroupAddonModule, InputNumberModule, SelectModule, ButtonModule, IftaLabelModule, KeyFilterModule, CamposClinicaComponent, CamposOftalmologiaComponent, CamposFonoaudiologiaComponent, CamposOdontologiaComponent, PanelModule],
  templateUrl: './personalizada.component.html',
  styleUrl: './personalizada.component.css',
})
export class PersonalizadaComponent implements OnInit {
  @Output() consultasEmitidas = new EventEmitter<Consulta[]>();

  public loadingCursos = false;
  public loadingInstituciones = false;
  public loadingProfesionales = false;
  public loading = false;
  public mostrarBotonDescarga = false;
  public generandoCsv = false;
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
    private _csvService: CsvService,
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
    this.formBusqueda.get('derivaciones')?.reset();
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
            this.mostrarBotonDescarga = this.resultados && this.resultados.length > 0 && this.formBusqueda.get('consultasSeleccionadas')?.value !== null && this.formBusqueda.get('consultasSeleccionadas')?.value.length === 1;
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
      this.formBusqueda.get('derivaciones')?.reset();
    }
  }

  generarCsv() {
    this.generandoCsv = true;
    const resultado = prepararData(this.formBusqueda.value);
    const dataLimpia = eliminarValoresNulosYVacios(resultado);
    this._csvService.generarCsv(dataLimpia).subscribe({
      next: (response: any) => {
        if (response.success) {
          // Descargar el archivo
          const nombreArchivo = response.data;
          this._csvService.descargarCsv(nombreArchivo).subscribe((blob) => {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = nombreArchivo;
            link.click();
            window.URL.revokeObjectURL(url);
            this.generandoCsv = false;
          });
        }
      },
      error: (err: any) => {
        MostrarNotificacion.mensajeErrorServicio(this.snackBar, err);
        this.generandoCsv = false;
      },
    });
  }
}

function prepararData(data: any): any {
  let derivaciones;
  if (data.derivaciones !== '' && data.derivaciones) {
    derivaciones = data.derivaciones?.reduce((acc: any, item: any) => {
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
    data.generales.derivaciones = derivaciones;
    delete data.derivaciones;
  } else if (data.generales.derivaciones) {
    delete data.generales.derivaciones;
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
