import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

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
import { Taller } from '@app/models/taller.model';

@Component({
  selector: 'app-form-taller',
  standalone: true,
  imports: [InputTextComponent, ReactiveFormsModule, InputSelectEnumComponent, InputDateComponent, InputTextareaComponent, LoadingComponent, InputSelectComponent],
  templateUrl: './form-taller.component.html',
})
export class FormTallerComponent implements OnInit {
  @Input() esFormulario = true;
  @Input() taller: Taller | null = null;
  @Output() editoTaller: EventEmitter<boolean> = new EventEmitter<boolean>();

  public tallerForm: FormGroup;
  public fechaHoy = new Date();
  public con = Constantes;

  public cursos: Curso[] = [];
  public cursosOriginales: Curso[] = [];
  public marcos: Marco[] = [];
  public marcosOriginales: Marco[] = [];
  public instituciones: Institucion[] = [];
  public especialidades: Especialidad[] = [];

  public mostrarCepillos = false;
  public habilitarModificar = false;
  public estaEditando = false;
  public searching = false;
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
      cant_encuentros: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(5), ValidarSoloNumeros]],
      destinatarios: ['', [Validators.required]],
      cant_participantes: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(5), ValidarSoloNumeros]],
      turno: ['', [Validators.required]],
      frecuencia: ['', [Validators.required]],
      es_taller: ['', [Validators.required]],
      conjunto_con: ['', [Validators.required]],
      entrega_cepillos: [''],
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
    this.esCargaOedicion();
  }

  obtenerCursos(): any {
    this.searchingCursos = true;
    this._cursoService.obtenerCursos().subscribe({
      next: (response: any) => {
        this.searchingCursos = false;
        this.cursosOriginales = response.data;
        if (!this.esFormulario && this.taller !== null) {
          this.cursos = this.cursosOriginales.filter((curso) => curso.nivel === this.taller?.institucion?.tipo);
          this.tallerForm.patchValue({
            id_curso: this.taller?.curso?.id,
          });
        }
      },
      error: (err: any) => {
        MostrarNotificacion.mensajeErrorServicio(this.snackBar, err);
      },
    });
  }

  obtenerInstituciones(): any {
    this.searchingInstituciones = true;
    this._institucionService.obtenerInstituciones().subscribe({
      next: (response: any) => {
        this.searchingInstituciones = false;
        this.instituciones = response.data;
        if (!this.esFormulario && this.taller) {
          this.tallerForm.patchValue({
            id_institucion: this.taller?.institucion?.id,
          });
        }
      },
      error: (err: any) => {
        MostrarNotificacion.mensajeErrorServicio(this.snackBar, err);
      },
    });
  }

  obtenerEspecialidades() {
    this.searchingEspecialidades = true;
    this._especialidadService.obtenerEspecialidades().subscribe({
      next: (response: any) => {
        this.searchingEspecialidades = false;
        this.especialidades = response.data;
        if (!this.esFormulario && this.taller) {
          this.tallerForm.patchValue({
            id_especialidad: this.taller?.especialidad?.id,
          });
          if (this.taller?.especialidad?.id === 4) this.mostrarCepillos = true;
        }
      },
      error: (err: any) => {
        MostrarNotificacion.mensajeErrorServicio(this.snackBar, err);
      },
    });
  }

  obtenerMarcos() {
    this.searchingMarcos = true;
    this._marcoService.obtenerMarcos().subscribe({
      next: (response: any) => {
        this.searchingMarcos = false;
        this.marcosOriginales = response.data;
        if (!this.esFormulario && this.taller) {
          const marcosFiltrados = this.marcosOriginales.filter((marco) => marco.especialidad?.id === this.taller?.especialidad?.id);
          this.marcos = marcosFiltrados;
          this.tallerForm.patchValue({
            id_marco: this.taller?.marco?.id,
          });
        }
      },
      error: (err: any) => {
        MostrarNotificacion.mensajeErrorServicio(this.snackBar, err);
      },
    });
  }

  esCargaOedicion() {
    if (!this.esFormulario && this.taller) {
      this.completarDatosForm();
      this.tallerForm.disable();
      this.tallerForm.valueChanges.subscribe({
        next: () => {
          this.habilitarModificar = this.existenCambios();
        },
      });
    }
  }

  completarDatosForm() {
    const stringFecha = String(this.taller?.fecha);

    const parseToLocalDate = (dateString: string): Date => {
      const [day, month, year] = dateString.split('-').map(Number);
      return new Date(year, month - 1, day);
    };
    const fechaFinal = parseToLocalDate(stringFecha);

    this.tallerForm.patchValue({
      nombre: this.taller?.nombre,
      fecha: fechaFinal,
      duracion: this.taller?.duracion,
      recursos: this.taller?.recursos,
      observaciones: this.taller?.observaciones,
      cant_encuentros: this.taller?.cant_encuentros,
      destinatarios: this.taller?.destinatarios,
      cant_participantes: this.taller?.cant_participantes,
      turno: this.taller?.turno,
      es_taller: this.taller?.es_taller,
      frecuencia: this.taller?.frecuencia,
      conjunto_con: this.taller?.conjunto_con,
      entrega_cepillos: this.taller?.entrega_cepillos,
    });
  }

  existenCambios() {
    let hayCambios = this.tallerForm.dirty;
    if (hayCambios) {
      if (
        this.taller?.nombre == this.tallerForm.value.nombre &&
        this.taller?.duracion == this.tallerForm.value.duracion &&
        this.taller?.recursos == this.tallerForm.value.recursos &&
        this.taller?.observaciones == this.tallerForm.value.observaciones &&
        this.taller?.cant_encuentros == this.tallerForm.value.cant_encuentros &&
        this.taller?.destinatarios == this.tallerForm.value.destinatarios &&
        this.taller?.cant_participantes == this.tallerForm.value.cant_participantes &&
        this.taller?.turno == this.tallerForm.value.turno &&
        this.taller?.frecuencia == this.tallerForm.value.frecuencia &&
        this.taller?.conjunto_con == this.tallerForm.value.conjunto_con &&
        this.taller?.curso?.id == this.tallerForm.value.id_curso &&
        this.taller?.institucion?.id == this.tallerForm.value.id_institucion &&
        this.taller?.especialidad?.id == this.tallerForm.value.id_especialidad &&
        this.taller?.marco?.id == this.tallerForm.value.id_marco &&
        this.taller?.entrega_cepillos == this.tallerForm.value.entrega_cepillos &&
        this.formatearFecha(this.tallerForm.value.fecha) === String(this.taller?.fecha)
      ) {
        hayCambios = false;
      } else {
        hayCambios = true;
      }
    }
    return !(this.tallerForm.valid && hayCambios);
  }

  formatearFecha(fecha: any) {
    const aux = new Date(String(fecha));
    aux.setHours(0, 0, 0, 0); // Establecer hora en 00:00:00
    return `${aux.getDate().toString().padStart(2, '0')}-${(aux.getMonth() + 1).toString().padStart(2, '0')}-${aux.getFullYear()}`;
  }

  activarFormulario() {
    this.tallerForm.enable();
    this.estaEditando = true;
  }

  desactivarFormulario() {
    this.tallerForm.disable();
    this.completarDatosForm();
    this.estaEditando = false;
  }

  onChangeInstitucion() {
    this.tallerForm.get('id_curso')?.setValue('');
    const idInstitucion = parseInt(this.tallerForm.value.id_institucion);
    const tipoInstitucion = this.instituciones?.find((institucion) => institucion.id === idInstitucion)?.tipo;
    const cursosFiltrados = this.cursosOriginales.filter((curso) => curso.nivel === tipoInstitucion);
    this.cursos = cursosFiltrados;
  }

  onChangeEspecialidad() {
    // Marco
    this.tallerForm.get('id_marco')?.setValue('');
    const idEspecialidad = parseInt(this.tallerForm.value.id_especialidad);
    const marcosFiltrados = this.marcosOriginales.filter((marco) => marco.especialidad?.id === idEspecialidad);
    this.marcos = marcosFiltrados;
    // Cepillo
    const cepilloControl = this.tallerForm.get('entrega_cepillos');
    if (idEspecialidad === 4) {
      this.mostrarCepillos = true;
      cepilloControl?.setValidators([Validators.required]);
    } else {
      this.mostrarCepillos = false;
      cepilloControl?.clearValidators();
      cepilloControl?.setValue(null); // Limpia el valor si no se va a mostrar
    }
    cepilloControl?.updateValueAndValidity();
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
                MostrarNotificacion.mensajeExito(this.snackBar, response.message);
                this.tallerForm.reset({ nombre: '', fecha: '', duracion: '', recursos: '', observaciones: '', cant_encuentros: '', destinatarios: '', cant_participantes: '', turno: '', frecuencia: '', conjunto_con: '', entrega_cepillos: '', id_curso: '', id_institucion: '', id_especialidad: '', id_marco: '' });
                this.mostrarCepillos = false;
              }
            },
            error: (err) => {
              MostrarNotificacion.mensajeErrorServicio(this.snackBar, err);
            },
          });
        }
      });
    } else {
      this.tallerForm.markAllAsTouched();
    }
  }

  editarTaller() {
    if (this.taller) {
      if (this.tallerForm.valid) {
        Swal.fire({
          title: '¿Modificar taller?',
          showDenyButton: true,
          confirmButtonColor: '#3f77b4',
          confirmButtonText: 'Confirmar',
          denyButtonText: `Cancelar`,
        }).then((result: any) => {
          if (result.isConfirmed && this.taller) {
            const dataLimpia = this.prepararDataEditar();
            this._tallerService.modificarTaller(this.taller.id, dataLimpia).subscribe({
              next: (response: any) => {
                this.editoTaller.emit(true);
                if (response.success) {
                  MostrarNotificacion.mensajeExito(this.snackBar, response.message);
                } else {
                  MostrarNotificacion.mensajeError(this.snackBar, response.message);
                }
              },
              error: (err: any) => {
                MostrarNotificacion.mensajeErrorServicio(this.snackBar, err);
              },
            });
          }
        });
      } else {
        this.tallerForm.markAllAsTouched();
      }
    } else {
      MostrarNotificacion.mensajeError(this.snackBar, 'No se esta editando ningun chico.');
    }
  }

  prepararDataEditar() {
    const stringFechaActual = String(new Date(String(this.taller?.fecha) + 'T12:00:00'));
    const stringFechaMod = String(this.tallerForm.value.fecha);
    const valorFecha = this.tallerForm.value.fecha.toISOString();
    const data = {
      ...(this.taller?.nombre !== this.tallerForm.value.nombre && { nombre: this.tallerForm.value.nombre }),
      ...(this.taller?.duracion !== this.tallerForm.value.duracion && { duracion: parseInt(this.tallerForm.value.duracion) }),
      ...(this.taller?.recursos !== this.tallerForm.value.recursos && { recursos: this.tallerForm.value.recursos }),
      ...(this.taller?.observaciones !== this.tallerForm.value.observaciones && { observaciones: this.tallerForm.value.observaciones }),
      ...(this.taller?.cant_encuentros !== this.tallerForm.value.cant_encuentros && { cant_encuentros: parseInt(this.tallerForm.value.cant_encuentros) }),
      ...(this.taller?.destinatarios !== this.tallerForm.value.destinatarios && { destinatarios: this.tallerForm.value.destinatarios }),
      ...(this.taller?.cant_participantes !== this.tallerForm.value.cant_participantes && { cant_participantes: parseInt(this.tallerForm.value.cant_participantes) }),
      ...(this.taller?.turno !== this.tallerForm.value.turno && { turno: this.tallerForm.value.turno }),
      ...(this.taller?.frecuencia !== this.tallerForm.value.frecuencia && { frecuencia: this.tallerForm.value.frecuencia }),
      ...(this.taller?.conjunto_con !== this.tallerForm.value.conjunto_con && { conjunto_con: this.tallerForm.value.conjunto_con }),
      ...(stringFechaActual !== stringFechaMod && { fecha: valorFecha }),
      ...(this.taller?.curso?.id !== +this.tallerForm.value.id_curso && { id_curso: parseInt(this.tallerForm.value.id_curso) }),
      ...(this.taller?.institucion?.id !== +this.tallerForm.value.id_institucion && { id_institucion: parseInt(this.tallerForm.value.id_institucion) }),
      ...(this.taller?.especialidad?.id !== +this.tallerForm.value.id_especialidad && { id_especialidad: parseInt(this.tallerForm.value.id_especialidad) }),
      ...(this.taller?.marco?.id !== +this.tallerForm.value.id_marco && { id_marco: parseInt(this.tallerForm.value.id_marco) }),
      ...(this.taller?.entrega_cepillos !== this.tallerForm.value.entrega_cepillos && { entrega_cepillos: this.tallerForm.value.entrega_cepillos === 'true' }),
      ...(this.taller?.es_taller !== this.tallerForm.value.es_taller && { es_taller: this.tallerForm.value.es_taller === 'true' }),
    };

    return data;
  }

  prepararData(data: any) {
    data.cant_encuentros = parseInt(data.cant_encuentros);
    data.duracion = parseInt(data.duracion);
    data.cant_participantes = parseInt(data.cant_participantes);
    data.id_curso = parseInt(data.id_curso);
    data.id_institucion = parseInt(data.id_institucion);
    data.id_especialidad = parseInt(data.id_especialidad);
    data.id_marco = parseInt(data.id_marco);
    data.es_taller = data.es_taller === 'true';
    data.entrega_cepillos = data.entrega_cepillos === 'true';

    if (data.observaciones?.length === 0) {
      delete data.observaciones;
    }

    return data;
  }
}
