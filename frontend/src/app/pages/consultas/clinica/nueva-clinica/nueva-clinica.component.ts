import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { catchError, debounceTime, map, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

import * as MostrarNotificacion from '../../../../utils/notificaciones/mostrar-notificacion';
import { ValidarCadenaSinEspacios, ValidarCampoOpcional, ValidarDni, ValidarHora, ValidarNumerosFloat, ValidarSoloLetras, ValidarSoloNumeros } from '../../../../utils/validadores';
import { Chico } from '../../../../models/chico.model';
import { ChicoService } from '../../../../services/chico.service';
import { Institucion } from '../../../../models/institucion.model';
import { InstitucionService } from '../../../../services/institucion.service';
import { Curso } from '../../../../models/curso.model';
import { CursoService } from '../../../../services/curso.service';
import { ConsultaService } from '../../../../services/consulta.service';

@Component({
  selector: 'app-nueva-clinica',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './nueva-clinica.component.html',
  styleUrl: './nueva-clinica.component.css',
})

/* SI EL DOCUMENTO SE PASA DE DIGITOS PERO ANTES ERA VALIDO SE VA A SEGUIR MOSTRANDO
EL MENSAJE DEL CHICO ENCONTRADO
*/
export class NuevaClinicaComponent implements OnInit {
  public clinicaForm: FormGroup;
  public chico: Chico | null = null;
  public instituciones: Institucion[] = [];
  public cursos: Curso[] = [];

  //@ViewChild(CamposGeneralesComponent) camposGenerales!: CamposGeneralesComponent;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private _chicoService: ChicoService,
    private _institucionService: InstitucionService,
    private _cursoService: CursoService,
    private _consultaService: ConsultaService,
  ) {
    this.clinicaForm = this.fb.group(
      {
        // Campos Generales
        type: ['Clinica', [Validators.required, ValidarSoloLetras]],
        obra_social: ['', [ValidarCampoOpcional(Validators.minLength(3), Validators.maxLength(100), ValidarCadenaSinEspacios, ValidarSoloLetras)]],
        edad: [1, [Validators.required, ValidarSoloNumeros]],
        observaciones: ['', [ValidarCampoOpcional(Validators.minLength(1), Validators.maxLength(1000), ValidarCadenaSinEspacios, ValidarSoloLetras)]],
        dni: [12345678, [Validators.required, ValidarSoloNumeros, ValidarDni]],
        // Campos medica clinica
        peso: [45.1, [Validators.required, ValidarNumerosFloat]],
        diabetes: [false, [Validators.required]],
        hta: [false, [Validators.required]],
        obesidad: [false, [Validators.required]],
        consumo_alcohol: [false, [Validators.required]],
        consumo_drogas: [false, [Validators.required]],
        antecedentes_perinatal: [false, [Validators.required]],
        enfermedades_previas: [false, [Validators.required]],
        vacunas: ['Algunas', [Validators.required, Validators.minLength(1), Validators.maxLength(100), ValidarCadenaSinEspacios]],
        talla: [1.11, [Validators.required, ValidarNumerosFloat]],
        cc: [2.22, [Validators.required, ValidarNumerosFloat]],
        // estado_nutricional: ['Bueno', [Validators.required, Validators.maxLength(100)]],  Faltan validaciones
        tas: [120.7, [Validators.required, ValidarNumerosFloat]], // Deberia ser solo entero ?
        tad: [70.2, [Validators.required, ValidarNumerosFloat]], // Deberia ser solo entero ?
        // tension_arterial: ['Tension arterial', [Validators.required, ValidarCadenaSinEspacios]], // Faltan // validaciones
        examen_visual: ['Bueno', [Validators.required, Validators.minLength(1), Validators.maxLength(100), ValidarCadenaSinEspacios]],
        ortopedia_traumatologia: ['ortopedia_traumatologia', [Validators.required, Validators.minLength(1), Validators.maxLength(100), ValidarCadenaSinEspacios]],
        lenguaje: ['Bueno', [Validators.required, Validators.minLength(1), Validators.maxLength(100), ValidarCadenaSinEspacios]],
        segto: [false, [Validators.required]],
        lacteos: [false, [Validators.required]],
        infusiones: [false, [Validators.required]],
        numero_comidas: [4, [Validators.required, ValidarSoloNumeros]],
        alimentacion: ['Buena', [Validators.required, Validators.minLength(1), Validators.maxLength(100), ValidarCadenaSinEspacios]],
        hidratacion: ['Buena', [Validators.required, Validators.minLength(1), Validators.maxLength(100), ValidarCadenaSinEspacios]],
        horas_pantalla: ['01:28', [Validators.required, Validators.minLength(1), Validators.maxLength(5), ValidarCadenaSinEspacios, ValidarHora]],
        horas_juego_airelibre: ['00:01', [Validators.required, Validators.minLength(1), Validators.maxLength(5), ValidarCadenaSinEspacios, ValidarHora]],
        horas_suenio: ['23:59', [Validators.required, Validators.minLength(1), Validators.maxLength(5), ValidarCadenaSinEspacios, ValidarHora]],
        proyecto: ['Control Niño Sano', [Validators.required, Validators.minLength(1), Validators.maxLength(100), ValidarCadenaSinEspacios]],
        // Deberia calcularlo el sistema y quiza usar ValidarNumerosFloat
        pcta: [7, [Validators.required, ValidarSoloNumeros]],
        pcimc: [2, [Validators.required, ValidarSoloNumeros]],
        // imc: [3, [Validators.required, ValidarSoloNumeros]],
        pct: [4, [Validators.required, ValidarSoloNumeros]],
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
    this.clinicaForm.get('dni')?.valueChanges.subscribe(() => {
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
    const dni = this.clinicaForm.get('dni')?.value;
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
            this.clinicaForm.get('chicoParam')?.setValue(response.data);
            console.log('Chico encontrado: ', this.clinicaForm.get('chicoParam')?.value);
          } else {
            this.chico = null;
            this.clinicaForm.get('chicoParam')?.setValue(null);
            console.log('Chico no encontrado, esto deberia ser null: ', this.clinicaForm.get('chicoParam')?.value);
          }
        }),
        catchError((error) => {
          this.chico = null;
          this.clinicaForm.get('chicoParam')?.setValue(null);
          console.error('Error al verificar el DNI:', error);
          return of(null);
        }),
      )
      .subscribe();
  }

  onCheckboxChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const value = checkbox.checked;
    const controlName = checkbox.id;
    this.clinicaForm.get(controlName)?.setValue(value);
  }

  // Validación personalizada para el DNI
  existeDni(control: AbstractControl): ValidationErrors | null {
    const chico = control.get('chico'); // Supone que estás almacenando el chico aquí
    if (chico !== null) {
      return { dniNoValido: false }; // Retorna un error si el chico no se encontró
    }
    return null; // Retorna null si es válido
  }

  enviarFormulario() {
    console.log('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ');
    console.log('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ');
    console.log('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ');
    console.log('FORMULARIO VALIDO:', this.clinicaForm.valid);
    console.log('- - - - - - - - Valores Generales - - - - - - - -');
    console.log('# 1 Valor de obra_social:', this.clinicaForm.get('obra_social')?.value);
    console.log('# 2 Valor de edad:', this.clinicaForm.get('edad')?.value);
    console.log('# 3 Valor de observaciones:', this.clinicaForm.get('observaciones')?.value);
    console.log('# 4 Valor de dni:', this.clinicaForm.get('dni')?.value);
    console.log('- - - - - - - - Valores Medica Clinica - - - - - - - -');
    console.log('# 5 Valor de peso:', this.clinicaForm.get('peso')?.value);
    console.log('# 6 Valor de diabetes:', this.clinicaForm.get('diabetes')?.value);
    console.log('# 7 Valor de hipertension arterial (hta):', this.clinicaForm.get('hta')?.value);
    console.log('# 8 Valor de obesidad:', this.clinicaForm.get('obesidad')?.value);
    console.log('# 9 Valor de consumo_alcohol:', this.clinicaForm.get('consumo_alcohol')?.value);
    console.log('# 10 Valor de consumo_drogas:', this.clinicaForm.get('consumo_drogas')?.value);
    console.log('# 11 Valor de antecedentes_perinatal:', this.clinicaForm.get('antecedentes_perinatal')?.value);
    console.log('# 12 Valor de enfermedades_previas:', this.clinicaForm.get('enfermedades_previas')?.value);
    console.log('# 13 Valor de vacunas:', this.clinicaForm.get('vacunas')?.value);
    console.log('# 14 Valor de talla:', this.clinicaForm.get('talla')?.value);
    console.log('# 15 Valor de cc:', this.clinicaForm.get('cc')?.value);
    console.log('# 16 Valor de estado_nutricional:', this.clinicaForm.get('estado_nutricional')?.value);
    console.log('# 17 Valor de tas:', this.clinicaForm.get('tas')?.value);
    console.log('# 18 Valor de tad:', this.clinicaForm.get('tad')?.value);
    console.log('# 19 Valor de tension_arterial:', this.clinicaForm.get('tension_arterial')?.value);
    console.log('# 20 Valor de examen_visual:', this.clinicaForm.get('examen_visual')?.value);
    console.log('# 21 Valor de ortopedia_traumatologia:', this.clinicaForm.get('ortopedia_traumatologia')?.value);
    console.log('# 22 Valor de segto:', this.clinicaForm.get('segto')?.value);
    console.log('# 23 Valor de lacteos:', this.clinicaForm.get('lacteos')?.value);
    console.log('# 24 Valor de infusiones:', this.clinicaForm.get('infusiones')?.value);
    console.log('# 25 Valor de numero_comidas:', this.clinicaForm.get('numero_comidas')?.value);
    console.log('# 26 Valor de alimentacion:', this.clinicaForm.get('alimentacion')?.value);
    console.log('# 27 Valor de hidratacion:', this.clinicaForm.get('hidratacion')?.value);
    console.log('# 28 Valor de horas_pantalla:', this.clinicaForm.get('horas_pantalla')?.value);
    console.log('# 29 Valor de horas_juego_airelibre:', this.clinicaForm.get('horas_juego_airelibre')?.value);
    console.log('# 30 Valor de horas_suenio:', this.clinicaForm.get('horas_suenio')?.value);
    console.log('# 31 Valor de proyecto:', this.clinicaForm.get('proyecto')?.value);
    console.log('# 32 Valor de pcta:', this.clinicaForm.get('pcta')?.value);
    console.log('# 33 Valor de pcimc:', this.clinicaForm.get('pcimc')?.value);
    console.log('# 34 Valor de imc:', this.clinicaForm.get('imc')?.value);
    console.log('# 35 Valor de pct:', this.clinicaForm.get('pct')?.value);
    console.log('# 36 Valor de id_institucion:', this.clinicaForm.get('id_institucion')?.value);
    console.log('- - - - - - - - Relaciones - - - - - - - -');
    console.log('# 36 ChicoParam: ', this.clinicaForm.get('chicoParam')?.value);
    console.log('- - - - - - - - Errores Generales - - - - - - - -');
    console.log('# 1 Errores en dni:', this.clinicaForm.get('dni')?.errors);
    console.log('# 2 Errores en edad:', this.clinicaForm.get('edad')?.errors);
    console.log('# 3 Errores en obra_social:', this.clinicaForm.get('obra_social')?.errors);
    console.log('# 4 Errores en observaciones:', this.clinicaForm.get('observaciones')?.errors);
    console.log('# 5 Errores en peso:', this.clinicaForm.get('peso')?.errors);
    console.log('# 6 Errores en diabetes:', this.clinicaForm.get('diabetes')?.errors);
    console.log('# 7 Errores en hipertension arterial (hta):', this.clinicaForm.get('hta')?.errors);
    console.log('# 8 Errores en obesidad:', this.clinicaForm.get('obesidad')?.errors);
    console.log('# 9 Errores en consumo_alcohol:', this.clinicaForm.get('consumo_alcohol')?.errors);
    console.log('# 10 Errores en consumo_drogas:', this.clinicaForm.get('consumo_drogas')?.errors);
    console.log('# 11 Errores en antecedentes_perinatal:', this.clinicaForm.get('antecedentes_perinatal')?.errors);
    console.log('# 12 Errores en enfermedades_previas:', this.clinicaForm.get('enfermedades_previas')?.errors);
    console.log('# 13 Errores en vacunas:', this.clinicaForm.get('vacunas')?.errors);
    console.log('# 14 Errores en talla:', this.clinicaForm.get('talla')?.errors);
    console.log('# 15 Errores en cc:', this.clinicaForm.get('cc')?.errors);
    console.log('# 16 Errores en estado_nutricional:', this.clinicaForm.get('estado_nutricional')?.errors);
    console.log('# 17 Errores en tas:', this.clinicaForm.get('tas')?.errors);
    console.log('# 18 Errores en tad:', this.clinicaForm.get('tad')?.errors);
    console.log('# 19 Errores en tension_arterial:', this.clinicaForm.get('tension_arterial')?.errors);
    console.log('# 20 Errores en examen_visual:', this.clinicaForm.get('examen_visual')?.errors);
    console.log('# 21 Errores en ortopedia_traumatologia:', this.clinicaForm.get('ortopedia_traumatologia')?.errors);
    console.log('# 22 Errores en segto:', this.clinicaForm.get('segto')?.errors);
    console.log('# 23 Errores en lacteos:', this.clinicaForm.get('lacteos')?.errors);
    console.log('# 24 Errores en infusiones:', this.clinicaForm.get('infusiones')?.errors);
    console.log('# 25 Errores en numero_comidas:', this.clinicaForm.get('numero_comidas')?.errors);
    console.log('# 26 Errores en alimentacion:', this.clinicaForm.get('alimentacion')?.errors);
    console.log('# 27 Errores en hidratacion:', this.clinicaForm.get('hidratacion')?.errors);
    console.log('# 28 Errores en horas_pantalla:', this.clinicaForm.get('horas_pantalla')?.errors);
    console.log('# 29 Errores en horas_juego_airelibre:', this.clinicaForm.get('horas_juego_airelibre')?.errors);
    console.log('# 30 Errores en horas_suenio:', this.clinicaForm.get('horas_suenio')?.errors);
    console.log('# 31 Errores en proyecto:', this.clinicaForm.get('proyecto')?.errors);
    console.log('# 32 Errores en pcta:', this.clinicaForm.get('pcta')?.errors);
    console.log('# 33 Errores en pcimc:', this.clinicaForm.get('pcimc')?.errors);
    console.log('# 34 Errores en imc:', this.clinicaForm.get('imc')?.errors);
    console.log('# 35 Errores en pct:', this.clinicaForm.get('pct')?.errors);
    console.log('# 36 Errores en id_institucion:', this.clinicaForm.get('id_institucion')?.errors);
    if (this.clinicaForm.valid || 1 + 1 == 2) {
      // CAMBIAR!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      Swal.fire({
        title: '¿Cargar nueva consulta clinica?',
        showDenyButton: true,
        confirmButtonColor: '#3f77b4',
        confirmButtonText: 'Confirmar',
        denyButtonText: `Cancelar`,
      }).then((result: any) => {
        if (result.isConfirmed) {
          const formValues = this.clinicaForm.value;
          delete formValues.dni;
          const { type, obra_social, edad, id_institucion, id_curso, observaciones, chicoParam, ...clinicaValues } = formValues;
          const data = {
            type,
            obra_social,
            edad,
            chicoId: chicoParam.id,
            institucionId: parseInt(id_institucion),
            cursoId: parseInt(id_curso),
            observaciones,
            clinica: {
              ...clinicaValues,
            },
          };
          console.log('DATOS ENVIADOS');
          console.log(data);
          this._consultaService.cargarConsulta(data).subscribe({
            next: (response: any) => {
              if (response.success) {
                MostrarNotificacion.mensajeExito(this.snackBar, response.message);
                this.clinicaForm.reset();
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
