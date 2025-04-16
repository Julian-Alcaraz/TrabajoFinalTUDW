import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';

import * as Constantes from '@app/common/const/const';
import * as MostrarNotificacion from '@utils/notificaciones/mostrar-notificacion';
import { InputTextComponent } from '@components/inputs/input-text.component';
import { ValidarCadenaSinEspacios, ValidarCampoOpcional, ValidarSoloNumeros } from '@app/utils/validadores';
import { TallerService } from '@app/services/taller.service';
import { InputSelectEnumComponent } from '@components/inputs/input-select-enum.component';
import { InputDateComponent } from '@components/inputs/input-date.component';
import { InputTextareaComponent } from '@components/inputs/input-textarea.component';
import { CursoService } from '@app/services/curso.service';
import { InstitucionService } from '@app/services/institucion.service';
import { Curso } from '@app/models/curso.model';
import { Institucion } from '@app/models/institucion.model';
import { LoadingComponent } from '@components/loading/loading.component';
import { InputSelectComponent } from '@components/inputs/input-select.component';
import { EspecialidadService } from '@app/services/especialidad.service';
import { MarcoService } from '@app/services/marco.service';
import { Especialidad } from '@app/models/especialidad.model';
import { Marco } from '@app/models/marco.model';

@Component({
  selector: 'app-form-taller',
  standalone: true,
  imports: [InputTextComponent, ReactiveFormsModule, InputSelectEnumComponent, InputDateComponent, InputTextareaComponent, LoadingComponent, InputSelectComponent],
  templateUrl: './form-taller.component.html',
  styleUrl: './form-taller.component.css',
})
export class FormTallerComponent implements OnInit {
  @Input() esFormulario = true;

  public tallerForm: FormGroup;
  public fechaHoy = new Date();
  public con = Constantes;

  public cursos: Curso[] = [];
  public cursosOriginales: Curso[] = [];
  public marcos: Marco[] = [];
  public marcosOriginales: Marco[] = [];
  public instituciones: Institucion[] = [];
  public especialidades: Especialidad[] = [];

  public searchingCursos = true;
  public searchingInstituciones = true;
  public searchingEspecialidades = true;
  public searchingMarcos = true;

  constructor(
    private fb: FormBuilder,
    private _tallerService: TallerService,
    private snackBar: MatSnackBar,
    // private _dialog: MatDialog,
    private _cursoService: CursoService,
    private _institucionService: InstitucionService,
    private _especialidadService: EspecialidadService,
    private _marcoService: MarcoService,
  ) {
    this.tallerForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100), ValidarCadenaSinEspacios]],
      fecha: ['', [Validators.required]],
      duracion: ['', [Validators.required]],
      recursos: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100), ValidarCadenaSinEspacios]],
      observaciones: ['', [ValidarCampoOpcional(Validators.minLength(1), Validators.maxLength(1000), ValidarCadenaSinEspacios)]],
      cantEncuentros: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(5), ValidarSoloNumeros]],
      destinatarios: ['', [Validators.required]],
      cantParticipantes: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(5), ValidarSoloNumeros]],
      turno: ['', [Validators.required]],
      frecuencia: ['', [Validators.required]],
      conjuntoCon: ['', [Validators.required]],
      id_curso: ['', [Validators.required]],
      id_institucion: ['', [Validators.required]],
      id_especialidad: ['', [Validators.required]],
      id_marco: ['', [Validators.required]],
    });
  }

  get controlDeInput(): (input: string) => FormControl {
    return (input: string) => this.tallerForm.get(input) as FormControl;
  }

  ngOnInit(): void {
    this.obtenerCursos();
    this.obtenerInstituciones();
    this.obtenerEspecialidades();
    this.obtenerMarcos();
  }

  obtenerCursos(): any {
    this._cursoService.obtenerCursos().subscribe({
      next: (response: any) => {
        this.searchingCursos = false;
        this.cursosOriginales = response.data;
      },
      error: (err: any) => {
        MostrarNotificacion.mensajeErrorServicio(this.snackBar, err);
      },
    });
  }

  obtenerInstituciones(): any {
    this._institucionService.obtenerInstituciones().subscribe({
      next: (response: any) => {
        this.searchingInstituciones = false;
        this.instituciones = response.data;
      },
      error: (err: any) => {
        MostrarNotificacion.mensajeErrorServicio(this.snackBar, err);
      },
    });
  }

  obtenerEspecialidades() {
    this._especialidadService.obtenerEspecialidades().subscribe({
      next: (response: any) => {
        this.searchingEspecialidades = false;
        this.especialidades = response.data;
      },
      error: (err: any) => {
        MostrarNotificacion.mensajeErrorServicio(this.snackBar, err);
      },
    });
  }

  obtenerMarcos() {
    this._marcoService.obtenerMarcos().subscribe({
      next: (response: any) => {
        this.searchingMarcos = false;
        this.marcosOriginales = response.data;
      },
      error: (err: any) => {
        MostrarNotificacion.mensajeErrorServicio(this.snackBar, err);
      },
    });
  }

  onChangeInstitucion() {
    this.tallerForm.get('id_curso')?.setValue('');
    const idInstitucion = this.tallerForm.value.id_institucion;
    const tipoInstitucion = this.instituciones?.find((institucion) => institucion.id === parseInt(idInstitucion))?.tipo;
    const cursosFiltrados = this.cursosOriginales.filter((curso) => curso.nivel === tipoInstitucion);
    this.cursos = cursosFiltrados;
  }

  onChangeEspecialidad() {
    this.tallerForm.get('id_marco')?.setValue('');
    const idEspecialidad = this.tallerForm.value.id_especialidad;
    const marcosFiltrados = this.marcosOriginales.filter((marco) => marco.especialidad?.id === parseInt(idEspecialidad));
    this.marcos = marcosFiltrados;
  }

  cargarTaller() {
    if (this.tallerForm.valid) {
      Swal.fire({
        title: '¿Cargar nuevo taller?',
        showDenyButton: true,
        confirmButtonColor: '#3f77b4',
        confirmButtonText: 'Confirmar',
        denyButtonText: `Cancelar`,
      }).then((result: any) => {
        if (result.isConfirmed) {
          const dataLista = this.prepararData(this.tallerForm.value);
          this._tallerService.cargarTaller(dataLista).subscribe({
            next: (response: any) => {
              if (response.success) {
                console.log(response);
                MostrarNotificacion.mensajeExito(this.snackBar, response.message);
                this.tallerForm.reset({ nombre: '', fecha: '', duracion: '', recursos: '', observaciones: '', cantEncuentros: '', destinatarios: '', cantParticipantes: '', turno: '', frecuencia: '', conjuntoCon: '', id_curso: '', id_institucion: '', id_especialidad: '', id_marco: '' });
              }
            },
            error: (err) => {
              MostrarNotificacion.mensajeErrorServicio(this.snackBar, err);
            },
          });
        }
      });
    }
  }

  prepararData(data: any) {
    data.cantEncuentros = parseInt(data.cantEncuentros);
    data.duracion = parseInt(data.duracion);
    data.cantParticipantes = parseInt(data.cantParticipantes);
    data.id_curso = parseInt(data.id_curso);
    data.id_institucion = parseInt(data.id_institucion);
    data.id_especialidad = parseInt(data.id_especialidad);
    data.id_marco = parseInt(data.id_marco);
    if (data.observaciones?.length === 0) {
      delete data.observaciones;
    }
    return data;
  }
}
