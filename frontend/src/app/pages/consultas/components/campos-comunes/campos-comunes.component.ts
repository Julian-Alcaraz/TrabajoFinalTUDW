import * as MostrarNotificacion from '../../../../utils/notificaciones/mostrar-notificacion';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { InputNumberComponent } from '../input-number/input-number.component';
import { InputTextComponent } from '../input-text/input-text.component';
import { InputSelectComponent } from '../input-select/input-select.component';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextareaComponent } from '../input-textarea/input-textarea.component';
import { ValidarCadenaSinEspacios, ValidarCampoOpcional, ValidarDni, ValidarSoloLetras, ValidarSoloNumeros, ValidarTipoInstitucion, ValidarTurno } from '../../../../utils/validadores';
import { ChicoService } from '../../../../services/chico.service';
import { catchError, debounceTime, map, of } from 'rxjs';
import { Chico } from '../../../../models/chico.model';
import { Institucion } from '../../../../models/institucion.model';
import { Curso } from '../../../../models/curso.model';
import { CursoService } from '../../../../services/curso.service';
import { InstitucionService } from '../../../../services/institucion.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-campos-comunes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputNumberComponent, InputTextComponent, InputSelectComponent, InputTextareaComponent],
  templateUrl: './campos-comunes.component.html',
  styleUrl: './campos-comunes.component.css',
})
export class CamposComunesComponent implements OnInit {
  @Input() form!: FormGroup;

  public chico: Chico | null = null;
  public instituciones: Institucion[] = [];
  public cursos: Curso[] = [];
  public institucionForm: FormGroup;
  public cursoForm: FormGroup;
  // public errorDni: string | null = null;

  @ViewChild('institucionModal') institucionModal!: TemplateRef<any>;
  @ViewChild('cursoModal') cursoModal!: TemplateRef<any>;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private _router: Router,
    private _cursoService: CursoService,
    private _chicoService: ChicoService,
    private _institucionService: InstitucionService,
    private _dialog: MatDialog,
  ) {
    // Formulario para crear una nueva institucion
    this.institucionForm = this.fb.group({
      nombre: ['', [Validators.required, ValidarCadenaSinEspacios, Validators.minLength(1), Validators.maxLength(100)]],
      tipo: ['', [Validators.required, ValidarCadenaSinEspacios, ValidarTipoInstitucion]], // ValidarTipoInstitucion no funciona
    });

    // Formulario para crear un nuevo curso
    this.cursoForm = this.fb.group({
      nombre: ['', [Validators.required, ValidarCadenaSinEspacios, Validators.minLength(1), Validators.maxLength(100)]],
      // Validar que grado sea positivo
      grado: ['', [Validators.required, ValidarSoloNumeros]],
      /*
        HACER VALIDADOR ENUM GLOBAL.

        @IsEnum(['Primaria', 'Secundario', 'Jardin', 'Terciario', 'Universitario'], { message: 'No es un nivel valido. Primaria, Secundario, Jardin, Terciario, Universitario' })
        readonly nivel: nivelCurso;
      */
      nivel: ['', [Validators.required, ValidarCadenaSinEspacios]],
    });
  }

  // HACER UNO DE ESTOS PARA TODOS LOS FORM, NO USAR 3
  get controlDeInput(): (input: string) => FormControl {
    return (input: string) => this.form.get(input) as FormControl;
  }
  get controlDeInputInstitucion(): (input: string) => FormControl {
    return (input: string) => this.institucionForm.get(input) as FormControl;
  }

  get controlDeInputCurso(): (input: string) => FormControl {
    return (input: string) => this.cursoForm.get(input) as FormControl;
  }

  ngOnInit(): void {
    this.obtenerInstituciones();
    this.obtenerCursos();

    this.form.addControl('edad', new FormControl(1, [Validators.required, ValidarSoloNumeros]));
    this.form.addControl('dni', new FormControl(12345678, [Validators.required, ValidarSoloNumeros, ValidarDni]));
    this.form.addControl('obra_social', new FormControl('', [ValidarCampoOpcional(Validators.minLength(3), Validators.maxLength(100), ValidarCadenaSinEspacios, ValidarSoloLetras)]));
    this.form.addControl('chicoParam', new FormControl(null, [Validators.required]));
    this.form.addControl('id_institucion', new FormControl('', [Validators.required]));
    this.form.addControl('id_curso', new FormControl('', [Validators.required]));
    this.form.addControl('turno', new FormControl('', [Validators.required, ValidarTurno]));
    //this.form.addControl('observaciones', new FormControl('', [ValidarCampoOpcional(Validators.minLength(1), Validators.maxLength(1000), ValidarCadenaSinEspacios, ValidarSoloLetras)]));

    this.form.get('dni')?.valueChanges.subscribe(() => {
      this.onChangeDni();
    });
  }

  onChangeDni() {
    const dni = this.form.get('dni')?.value;
    // this.errorDni = null;
    if (!dni || dni.toString().length !== 8) {
      console.log('El DNI no tiene 8 dígitos');
      return;
    }
    console.log('El DNI tiene 8 dígitos, procediendo a verificar');
    this._chicoService
      .obtenerChicoxDni(dni)
      .pipe(
        debounceTime(300),
        map((response) => {
          console.log('Respuesta recibida:', response);
          if (response?.success) {
            this.chico = response.data;
            this.form.get('chicoParam')?.setValue(response.data);
            // this.errorDni = null;
            console.log('Chico encontrado: ', this.form.get('chicoParam')?.value);
          } else {
            this.chico = null;
            this.form.get('chicoParam')?.setValue(null);
            // this.errorDni = 'No hay chico con ese DNI.';
            console.log('Chico no encontrado, esto deberia ser null: ', this.form.get('chicoParam')?.value);
          }
        }),
        catchError((error) => {
          this.chico = null;
          this.form.get('chicoParam')?.setValue(null);
          console.error('Error al verificar el DNI:', error);
          return of(null);
        }),
      )
      .subscribe();
  }

  obtenerInstituciones(): any {
    this._cursoService.obtenerCursos().subscribe({
      next: (response: any) => {
        this.cursos = response.data;
      },
      error: (err: any) => {
        MostrarNotificacion.mensajeErrorServicio(this.snackBar, err);
      },
    });
  }

  obtenerCursos(): any {
    this._institucionService.obtenerInstituciones().subscribe({
      next: (response: any) => {
        this.instituciones = response.data;
      },
      error: (err: any) => {
        MostrarNotificacion.mensajeErrorServicio(this.snackBar, err);
      },
    });
  }

  // Modal institucion

  onChangeInstitucion() {
    const id_institucion = this.form.get('id_institucion')?.value;
    if (id_institucion === 'new') {
      this.abrirModalInstitucion();
    }
  }

  abrirModalInstitucion() {
    const dialogRef = this._dialog.open(this.institucionModal, { width: '40%' });
    dialogRef.afterClosed().subscribe(() => {
      this.institucionForm.reset();
    });
  }

  cargarInstitucion() {
    console.log(this.institucionForm.value);
    if (this.institucionForm.valid) {
      Swal.fire({
        title: '¿Cargar nueva institución?',
        showDenyButton: true,
        confirmButtonColor: '#3f77b4',
        confirmButtonText: 'Confirmar',
        denyButtonText: `Cancelar`,
      }).then((result: any) => {
        if (result.isConfirmed) {
          const data = this.institucionForm.value;
          console.log('DATA');
          console.log(data);
          this._institucionService.cargarInstitucion(data).subscribe({
            next: (response: any) => {
              if (response.success) {
                MostrarNotificacion.mensajeExito(this.snackBar, response.message);
                this.cerrarModalInstitucion();
                this.obtenerInstituciones();
                this.institucionForm.get('nombre')?.setValue('');
                this.institucionForm.get('tipo')?.setValue('');
                // Aca se podria poner en el input de institucion la institucion recien creado
                // this.cerrarModalInstitucion();
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

  cerrarModalInstitucion() {
    this._dialog.closeAll();
    this.institucionForm.get('id_institucion')?.setValue('');
    this.institucionForm.get('tipo')?.setValue('');
    this.form.get('id_institucion')?.setValue('');
  }

  // Modal curso

  onChangeCurso() {
    const id_curso = this.form.get('id_curso')?.value;
    if (id_curso === 'new') {
      this.abrirModalCurso();
    }
  }

  abrirModalCurso() {
    const dialogRef = this._dialog.open(this.cursoModal, { width: '40%' });
    dialogRef.afterClosed().subscribe(() => {
      this.cursoForm.reset();
    });
  }

  cargarCurso() {
    console.log(this.cursoForm.value);
    if (this.cursoForm.valid) {
      Swal.fire({
        title: '¿Cargar nuevo curso?',
        showDenyButton: true,
        confirmButtonColor: '#3f77b4',
        confirmButtonText: 'Confirmar',
        denyButtonText: `Cancelar`,
      }).then((result: any) => {
        if (result.isConfirmed) {
          const data = this.cursoForm.value;
          console.log('DATA');
          console.log(data);
          this._cursoService.cargarCurso(data).subscribe({
            next: (response: any) => {
              if (response.success) {
                MostrarNotificacion.mensajeExito(this.snackBar, response.message);
                this.cerrarModalCurso();
                this.obtenerCursos();
                this.cursoForm.get('nombre')?.setValue('');
                this.cursoForm.get('tipo')?.setValue('');
                this.cursoForm.get('grado')?.setValue('');
                // Aca se podria poner en el input de curso el curso recien creado
                // this.cerrarModalInstitucion();
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

  cerrarModalCurso() {
    this._dialog.closeAll();
    // cambiar...!!!!!!!
    this.institucionForm.get('id_institucion')?.setValue('');
    this.institucionForm.get('tipo')?.setValue('');
    this.form.get('id_institucion')?.setValue('');
  }

  cargarChico() {
    this._router.navigate(['/layout/chicos/nuevo']);
  }

  /*
  onSubmit() {
    // Verificar si hay un chico cargado
    if (!this.chico) {
      this.errorDni = 'No hay chico con ese DNI. Debes buscar uno antes de enviar el formulario.';
      return; // No enviar el formulario si no hay chico
    }

    // Lógica para enviar el formulario
    console.log('Formulario enviado', this.form.value);
  }
    */
}
