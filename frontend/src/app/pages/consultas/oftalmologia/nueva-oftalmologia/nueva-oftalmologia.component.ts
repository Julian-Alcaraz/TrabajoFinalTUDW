import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ValidarCadenaSinEspacios, ValidarCampoOpcional, ValidarDni, ValidarSoloLetras, ValidarSoloNumeros } from '../../../../utils/validadores';
import { CursoService } from '../../../../services/curso.service';
import { Chico } from '../../../../models/chico.model';
import { Institucion } from '../../../../models/institucion.model';
import { Curso } from '../../../../models/curso.model';
import * as MostrarNotificacion from '../../../../utils/notificaciones/mostrar-notificacion';
import { catchError, debounceTime, map, of } from 'rxjs';
import { InstitucionService } from '../../../../services/institucion.service';
import { ChicoService } from '../../../../services/chico.service';
import Swal from 'sweetalert2';
import { ConsultaService } from '../../../../services/consulta.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-nueva-oftalmologia',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDatepickerModule, MatFormFieldModule, MatInputModule],
  templateUrl: './nueva-oftalmologia.component.html',
  styleUrl: './nueva-oftalmologia.component.css',
})
export class NuevaOftalmologiaComponent implements OnInit {
  public oftalmologiaForm: FormGroup;
  public chico: Chico | null = null;
  public instituciones: Institucion[] = [];
  public cursos: Curso[] = [];
  public fechaManana = new Date(new Date().setDate(new Date().getDate() + 1));


  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private _cursoService: CursoService,
    private _chicoService: ChicoService,
    private _institucionService: InstitucionService,
    private _consultaService: ConsultaService,
  ) {
    this.oftalmologiaForm = this.fb.group(
      {
        // Campos Generales
        type: ['Oftalmologia', [Validators.required, ValidarSoloLetras]],
        obra_social: ['', [ValidarCampoOpcional(Validators.minLength(3), Validators.maxLength(100), ValidarCadenaSinEspacios, ValidarSoloLetras)]],
        edad: [1, [Validators.required, ValidarSoloNumeros]],
        observaciones: ['', [ValidarCampoOpcional(Validators.minLength(1), Validators.maxLength(1000), ValidarCadenaSinEspacios, ValidarSoloLetras)]],
        dni: [12345678, [Validators.required, ValidarSoloNumeros, ValidarDni]],
        // Campos oftalmologia
        demanda: ['Buena', [Validators.required, Validators.minLength(1), Validators.maxLength(100), ValidarCadenaSinEspacios]],
        primera_vez: [false, [Validators.required]],
        control: [false, [Validators.required]],
        receta: [false, [Validators.required]],
        anteojos: [false, [Validators.required]],
        prox_control: [this.fechaManana, Validators.required],
        // Relaciones
        chicoParam: [null, [Validators.required]], // Esta solo para que valide antes de enviar el form, se podria armar de otra forma
        id_institucion: ['', [Validators.required]],
        id_curso: ['', [Validators.required]],
      },
      {
        validators: this.existeDni,
      },
    );
    // Deberia ser redundante esto pero no funciona bien si lo saco:
    this.oftalmologiaForm.get('dni')?.valueChanges.subscribe(() => {
      this.onChangeDni();
    });
  }
  ngOnInit(): void {
    this.obtenerInstituciones();
    this.obtenerCursos();
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

  // Podria ponerse en otro lado esto:
  onChangeDni() {
    const dni = this.oftalmologiaForm.get('dni')?.value;
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
            this.oftalmologiaForm.get('chicoParam')?.setValue(response.data);
            console.log('Chico encontrado: ', this.oftalmologiaForm.get('chicoParam')?.value);
          } else {
            this.chico = null;
            this.oftalmologiaForm.get('chicoParam')?.setValue(null);
            console.log('Chico no encontrado, esto deberia ser null: ', this.oftalmologiaForm.get('chicoParam')?.value);
          }
        }),
        catchError((error) => {
          this.chico = null;
          this.oftalmologiaForm.get('chicoParam')?.setValue(null);
          console.error('Error al verificar el DNI:', error);
          return of(null);
        }),
      )
      .subscribe();
  }

  // Validación personalizada para el DNI
  existeDni(control: AbstractControl): ValidationErrors | null {
    const chico = control.get('chico'); // Supone que estás almacenando el chico aquí
    if (chico !== null) {
      return { dniNoValido: false }; // Retorna un error si el chico no se encontró
    }
    return null; // Retorna null si es válido
  }

  onCheckboxChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const value = checkbox.checked;
    const controlName = checkbox.id;
    this.oftalmologiaForm.get(controlName)?.setValue(value);
  }

  enviarFormulario() {
    console.log('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ');
    console.log('FORMULARIO VALIDO:', this.oftalmologiaForm.valid);
    console.log('- - - - - - - - Valores Generales - - - - - - - -');
    console.log('# 1 Valor de obra_social:', this.oftalmologiaForm.get('obra_social')?.value);
    console.log('# 2 Valor de edad:', this.oftalmologiaForm.get('edad')?.value);
    console.log('# 3 Valor de observaciones:', this.oftalmologiaForm.get('observaciones')?.value);
    console.log('# 4 Valor de dni:', this.oftalmologiaForm.get('dni')?.value);
    console.log('- - - - - - - - Valores Oftalmologia - - - - - - - -');
    console.log('Agregarlos...');
    console.log('- - - - - - - - Relaciones - - - - - - - -');
    console.log('# 36 ChicoParam: ', this.oftalmologiaForm.get('chicoParam')?.value);
    console.log('# 37 Valor de id_institucion:', this.oftalmologiaForm.get('id_institucion')?.value);
    console.log('# 38 Valor de id_curso:', this.oftalmologiaForm.get('id_curso')?.value);
    console.log('- - - - - - - - Errores Generales - - - - - - - -');
    console.log('# 1 Errores en dni:', this.oftalmologiaForm.get('dni')?.errors);
    console.log('# 2 Errores en edad:', this.oftalmologiaForm.get('edad')?.errors);
    console.log('# 3 Errores en obra_social:', this.oftalmologiaForm.get('obra_social')?.errors);
    console.log('# 4 Errores en observaciones:', this.oftalmologiaForm.get('observaciones')?.errors);
    console.log('- - - - - - - - Errores Odontología - - - - - - - -');
    console.log('Agregarlos...');

    if (this.oftalmologiaForm.valid) {
      Swal.fire({
        title: '¿Cargar nueva consulta oftalmologica?',
        showDenyButton: true,
        confirmButtonColor: '#3f77b4',
        confirmButtonText: 'Confirmar',
        denyButtonText: `Cancelar`,
      }).then((result: any) => {
        if (result.isConfirmed) {
          console.log('valido');
          const formValues = this.oftalmologiaForm.value;
          delete formValues.dni;
          const { type, obra_social, edad, id_institucion, id_curso, observaciones, chicoParam, ...oftalmologiaValues } = formValues;
          const data = {
            type,
            obra_social,
            edad,
            chicoId: chicoParam.id,
            institucionId: parseInt(id_institucion),
            cursoId: parseInt(id_curso),
            observaciones,
            oftalmologia: {
              ...oftalmologiaValues,
            },
          };
          console.log(data);
          this._consultaService.cargarConsulta(data).subscribe({
            next: (response: any) => {
              if (response.success) {
                MostrarNotificacion.mensajeExito(this.snackBar, response.message);
                this.oftalmologiaForm.reset();
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
}
