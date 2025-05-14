import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin, Subscription } from 'rxjs';

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

import * as Constantes from '@app/common/const/const';
import * as MostrarNotificacion from '@utils/notificaciones/mostrar-notificacion';
import { Usuario } from '@models/usuario.model';
import { UsuarioService } from '@services/usuario.service';
import { InstitucionService } from '@services/institucion.service';
import { Institucion } from '@models/institucion.model';
import { Curso } from '@models/curso.model';
import { CursoService } from '@services/curso.service';
import { ConsultaService } from '@services/consulta.service';
import { Consulta } from '@models/consulta.model';
import { CamposClinicaComponent } from './components/campos-clinica/campos-clinica.component';
import { CamposOftalmologiaComponent } from './components/campos-oftalmologia/campos-oftalmologia.component';
import { CamposFonoaudiologiaComponent } from './components/campos-fonoaudiologia/campos-fonoaudiologia.component';
import { CamposOdontologiaComponent } from './components/campos-odontologia/campos-odontologia.component';
import { ProcesamientoService } from '@app/services/procesamiento.service';
import { LoadingComponent } from '@components/loading/loading.component';
import { PaginatedTableService } from '@app/services/paginated-table.service';
import { CamposPrevencionComponent } from './components/campos-prevencion/campos-prevencion.component';
import { CamposSocialComponent } from './components/campos-social/campos-social.component';

@Component({
  selector: 'app-personalizada',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoadingComponent, DatePickerModule, FloatLabelModule, MultiSelectModule, SelectButtonModule, InputGroupModule, InputGroupAddonModule, InputNumberModule, SelectModule, ButtonModule, IftaLabelModule, KeyFilterModule, CamposClinicaComponent, CamposOftalmologiaComponent, CamposFonoaudiologiaComponent, CamposOdontologiaComponent, PanelModule, CamposPrevencionComponent, CamposSocialComponent],
  templateUrl: './personalizada.component.html',
})
export class PersonalizadaComponent implements OnInit, OnDestroy {
  @Output() consultasEmitidas = new EventEmitter<Consulta[]>();

  public con = Constantes;
  public loadingCursos = false;
  public loadingInstituciones = false;
  public loadingProfesionales = false;
  public mostrarBotonDescarga = false;
  public generandoArchivo = false;
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
  public tipoConsulta: string[] = this.con.ConsultaEnum;
  public siNoOptions: any[] = [
    { nombre: 'Si', valor: true },
    { nombre: 'No', valor: false },
  ];
  public turnoOptions: string[] = this.con.TurnoEnum;
  public sexoOptions: string[] = this.con.SexoEnum;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private _cursoService: CursoService,
    private _institucionService: InstitucionService,
    private _usuarioService: UsuarioService,
    private _consultaService: ConsultaService,
    private _procesamientoService: ProcesamientoService,
    private _tableService: PaginatedTableService,
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

    this.listenPager();
  }

  listenerPaginator: Subscription = new Subscription();
  page = 0;
  size = 10;

  listenPager() {
    this.listenerPaginator = this._tableService.listenPaginated().subscribe((paginated) => {
      // si hay cambios los busca
      if (this.page !== paginated.pageIndex || this.size !== paginated.pageSize) {
        this.page = paginated.pageIndex;
        this.size = paginated.pageSize;
        this.buscar();
      }
    });
  }

  ngOnDestroy() {
    this.listenerPaginator.unsubscribe();
  }

  onChangeTipoConsulta() {
    this.formBusqueda.removeControl('especificas');
    if (this.formBusqueda.get('consultasSeleccionadas')?.value && this.formBusqueda.get('consultasSeleccionadas')?.value.length === 0) {
      this.formBusqueda.get('consultasSeleccionadas')?.reset();
    }
  }

  submit() {
    this._tableService.resetService();
    this.buscar();
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
    if (this.formBusqueda.valid) {
      this.searching = true;
      this.colapsarPaneles = true;
      const resultado = prepararData(this.formBusqueda.value);
      const dataLimpia = eliminarValoresNulosYVacios(resultado);
      forkJoin({
        total: this._consultaService.obtenerTotalPersonalizada(dataLimpia),
        limitedData: this._consultaService.busquedaPersonalizadaLimited(dataLimpia, this.page, this.size),
      }).subscribe({
        next: (responses: { total: any; limitedData: any }) => {
          this._tableService.updateData({ array: responses.limitedData.data, total: responses.total.data });
          this.mostrarBotonDescarga = true;
          this.searching = false;
        },
        error: (err: any) => {
          MostrarNotificacion.mensajeErrorServicio(this.snackBar, err);
          this.mostrarBotonDescarga = false;
          this.searching = false;
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

  exportarXLS(): void {
    const resultado = prepararData(this.formBusqueda.value);
    const dataLimpia = eliminarValoresNulosYVacios(resultado);
    this.generandoArchivo = true;
    this._procesamientoService.exportarConsultas(dataLimpia).subscribe({
      next: (res: any) => {
        const nombreArchivo = res.headers.get('Content-Disposition').match(/filename="(.+)"/)[1];
        const blob = res.body;
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = nombreArchivo;
        a.click();
        window.URL.revokeObjectURL(url);
        MostrarNotificacion.mensajeExito(this.snackBar, 'Archivo XLS descargado');
        this.generandoArchivo = false;
      },
      error: (err: any) => {
        this.generandoArchivo = false;
        MostrarNotificacion.mensajeErrorServicio(this.snackBar, err);
      },
    });
  }
}

function prepararData(data: any): any {
  if (data.especificas && data.especificas?.derivaciones !== '' && data.especificas?.derivaciones && data.especificas?.derivaciones !== null) {
    if (Array.isArray(data.especificas?.derivaciones)) {
      // Si es un array, reducimos los elementos a un único objeto
      const result = data.especificas.derivaciones.reduce((acc: any, curr: any) => {
        return { ...acc, ...curr };
      }, {});
      data.especificas.derivaciones = result;
      let derivacion_odontologia, derivacion_oftalmologia, derivacion_fonoaudiologia, derivacion_externa, derivacion_prevencion, derivacion_social;
      const derivaciones = data.especificas.derivaciones;
      if (derivaciones.fonoaudiologia !== undefined) {
        derivacion_fonoaudiologia = derivaciones.fonoaudiologia;
      }
      if (derivaciones.odontologia !== undefined) {
        derivacion_odontologia = derivaciones.odontologia;
      }
      if (derivaciones.oftalmologia !== undefined) {
        derivacion_oftalmologia = derivaciones.oftalmologia;
      }
      if (derivaciones.externa !== undefined) {
        derivacion_externa = derivaciones.externa;
      }
      if (derivaciones.prevencion !== undefined) {
        derivacion_prevencion = derivaciones.prevencion;
      }
      if (derivaciones.social !== undefined) {
        derivacion_social = derivaciones.social;
      }
      data.generales.derivacion_odontologia = derivacion_odontologia;
      data.generales.derivacion_oftalmologia = derivacion_oftalmologia;
      data.generales.derivacion_fonoaudiologia = derivacion_fonoaudiologia;
      data.generales.derivacion_externa = derivacion_externa;
      data.generales.derivacion_prevencion = derivacion_prevencion;
      data.generales.derivacion_social = derivacion_social;
    } else if (typeof data.especificas?.derivaciones === 'object') {
      console.log(data.especificas);
      console.log(data.especificas?.derivaciones);
      const derivaciones = data.especificas.derivaciones;
      if (derivaciones.fonoaudiologia !== undefined) {
        data.generales.derivacion_fonoaudiologia = derivaciones.fonoaudiologia;
      }
      if (derivaciones.odontologia !== undefined) {
        data.generales.derivacion_odontologia = derivaciones.odontologia;
      }
      if (derivaciones.oftalmologia !== undefined) {
        data.generales.derivacion_oftalmologia = derivaciones.oftalmologia;
      }
      if (derivaciones.externa !== undefined) {
        data.generales.derivacion_externa = derivaciones.externa;
      }
      if (derivaciones.prevencion !== undefined) {
        data.generales.derivacion_prevencion = derivaciones.prevencion;
      }
      if (derivaciones.social !== undefined) {
        data.generales.derivacion_social = derivaciones.social;
      }
    }

    delete data.especificas.derivaciones;
  } else {
    data.generales.derivacion_odontologia = undefined;
    data.generales.derivacion_oftalmologia = undefined;
    data.generales.derivacion_fonoaudiologia = undefined;
    data.generales.derivacion_externa = undefined;
    data.generales.derivacion_prevencion = undefined;
    data.generales.derivacion_social = undefined;
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
