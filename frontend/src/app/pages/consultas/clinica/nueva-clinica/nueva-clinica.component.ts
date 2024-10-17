import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { catchError, debounceTime, map, of } from 'rxjs';
import Swal from 'sweetalert2';

import { CamposGeneralesComponent } from '../../shared/campos-generales/campos-generales.component';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ValidarCadenaSinEspacios, ValidarCampoOpcional, ValidarDni, ValidarSoloLetras, ValidarSoloNumeros } from '../../../../utils/validadores';
import { ChicoService } from '../../../../services/chico.service';
import { Chico } from '../../../../models/chico.model';

/*
<!-- !!!!!!!!!!!!! 1. type:  enum: ['Clinica', 'Fonoaudiologia', 'Oftalmologia', 'Odontologia'] -->
<!-- 2. obra_social: string length: 100, nullable: true -->
<!-- 3. edad: number; type: 'int' -->
<!-- 4. observaciones: string; type: 'text', nullable: true-->
*/

@Component({
  selector: 'app-nueva-clinica',
  standalone: true,
  imports: [CamposGeneralesComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './nueva-clinica.component.html',
  styleUrl: './nueva-clinica.component.css',
})
export class NuevaClinicaComponent {
  public clinicaForm: FormGroup;
  //public errorDni: string | null = null; // Variable para almacenar mensajes de error
  public chico: Chico | null = null; // Variable para almacenar la respuesta del chico
  //@ViewChild(CamposGeneralesComponent) camposGenerales!: CamposGeneralesComponent;

  constructor(
    private fb: FormBuilder,
    private _chicoService: ChicoService,
  ) {
    this.clinicaForm = this.fb.group(
      {
        // Campos comunes

        camposGenerales: this.fb.group({
          obra_social: ['Osde', [ValidarCampoOpcional(Validators.minLength(3), Validators.maxLength(100), ValidarCadenaSinEspacios, ValidarSoloLetras)]],
          edad: [1, [Validators.required, ValidarSoloNumeros]],
          observaciones: ['', [ValidarCampoOpcional(Validators.minLength(1), Validators.maxLength(1000), ValidarCadenaSinEspacios, ValidarSoloLetras)]],
          dni: [42242041, [Validators.required, ValidarSoloNumeros, ValidarDni]], //Math.floor(10000000 + Math.random()  90000000),
        }),
        // Campos especificos

        peso: [45, [ValidarSoloNumeros]],
        diabetes: ['true', Validators.required],
        hta: ['true', Validators.required],
        obesidad: ['true', Validators.required],
        consumo_alcohol: ['true', Validators.required],
        consumo_drogas: ['true', Validators.required],
        antecedentes_perinatal: ['true', Validators.required],
        enfermedades_previas: ['true', Validators.required],
        vacunas: ['Tengo algunas', Validators.required],
        talla: [1.267, Validators.required],
        cc: [2.592, Validators.required],
        estado_nutricional: ['Bueno', Validators.required],
        tas: [120, Validators.required],
        tad: [70, Validators.required],
        tension_arterial: ['Tension arterial', Validators.required],
        examen_visual: ['Bueno', Validators.required],
        ortopedia_traumatologia: ['ortopedia_traumatologia', Validators.required],
        lenguaje: ['Bueno', Validators.required],
        segto: ['true', Validators.required],
        lacteos: ['true', Validators.required],
        infusiones: ['true', Validators.required],
        numero_comidas: [4, Validators.required],
        alimentacion: ['Buena', Validators.required],
        hidratacion: ['Buena', Validators.required],
        horas_pantalla: ['>2hs', Validators.required],
        horas_juego_airelibre: ['3hs', Validators.required],
        horas_suenio: ['>8hs', Validators.required],
        proyecto: ['Control Niño Sano', Validators.required],
        pcta: [0.01, Validators.required], // Deberia calcularlo el sistema
        pcimc: [0.01, Validators.required], // Deberia calcularlo el sistema
        imc: [0.01, Validators.required], // Deberia calcularlo el sistema
        pct: [0.01, Validators.required], // Deberia calcularlo el sistema
      },
      { validators: this.existeDni },
    );

    // Deberia ser redundante esto pero no funciona bien si lo saco:
    this.clinicaForm.get('camposGenerales.dni')?.valueChanges.subscribe(() => {
      this.onChangeDni();
    });
  }

  onChangeDni() { // OPC # 1
    // const dniControl = this.clinicaForm.get('camposGenerales.dni'); OPC #1
    // const dni = dniControl?.value; OPC #1
    const dni = this.clinicaForm.get('camposGenerales.dni')?.value;
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
            //dniControl?.setErrors(null); // Limpia el error si el DNI es válido OPC # 1
            this.chico = response.data; 
            console.log('Chico encontrado: ', this.chico);
            //this.errorDni = null; // Reinicia el mensaje de error
          } else {
            this.chico = null;
            // dniControl?.setErrors({ dniNoValido: true }); OPC # 1
            console.log('Chico encontrado, esto deberia ser null: ', this.chico);
          }
        }),
        catchError((error) => {
          console.error('Error al verificar el DNI:', error);
          this.chico = null;
          // dniControl?.setErrors({ dniNoValido: true }); OPC #1
          return of(null);
        }),
      )
      .subscribe(); // Asegúrate de suscribirte a la cadena de operadores
  }

  onChangeDni1() {
    const dni = this.clinicaForm.get('camposGenerales.dni')?.value;

    if (!dni || dni.toString().length !== 8) {
      console.log('El DNI no tiene 8 dígitos');
      return;
    }

    this._chicoService
      .obtenerChicoxDni(dni)
      .pipe(
        debounceTime(300),
        map((response) => {
          if (response?.success) {
            this.clinicaForm.get('camposGenerales')?.patchValue({ chico: response.data });
          } else {
            this.clinicaForm.get('camposGenerales')?.patchValue({ chico: null });
          }
        }),
        catchError((error) => {
          console.error('Error al verificar el DNI:', error);
          this.clinicaForm.get('camposGenerales')?.patchValue({ chico: null });
          return of(null);
        })
      )
      .subscribe();
  }


  // Validación personalizada para el DNI
  existeDni(control: AbstractControl): ValidationErrors | null {
    const chico = control.get('camposGenerales.chico'); // Supone que estás almacenando el chico aquí
    if (chico !== null) {
      return { dniNoValido: false }; // Retorna un error si el chico no se encontró
    }
    return null; // Retorna null si es válido
  }

  enviarFormulario() {
    // 5. Relacion con usuario creo
    // Campos comunes
    console.log('Formulario válido:', this.clinicaForm.valid);
    console.log('- - - - - - - - Valores - - - - - - - -');
    console.log('Valor de dni:', this.clinicaForm.get('camposGenerales.dni')?.value);
    console.log('Valor de edad:', this.clinicaForm.get('camposGenerales.edad')?.value);
    console.log('Valor de obra_social:', this.clinicaForm.get('camposGenerales.obra_social')?.value);
    console.log('Valor de observaciones:', this.clinicaForm.get('camposGenerales.observaciones')?.value);
    // Campos específicos
    console.log('Valor de diabetes:', this.clinicaForm.get('diabetes')?.value);
    console.log('Valor de vacunas:', this.clinicaForm.get('vacunas')?.value);
    console.log('Valor de talla:', this.clinicaForm.get('talla')?.value);
    console.log('Valor de cc:', this.clinicaForm.get('cc')?.value);
    console.log('Valor de estado_nutricional:', this.clinicaForm.get('estado_nutricional')?.value);
    console.log('Valor de tas:', this.clinicaForm.get('tas')?.value);
    console.log('Valor de tad:', this.clinicaForm.get('tad')?.value);
    console.log('Valor de tension_arterial:', this.clinicaForm.get('tension_arterial')?.value);
    console.log('Valor de examen_visual:', this.clinicaForm.get('examen_visual')?.value);
    console.log('Valor de ortopedia_traumatologia:', this.clinicaForm.get('ortopedia_traumatologia')?.value);
    console.log('Valor de segto:', this.clinicaForm.get('segto')?.value);
    console.log('Valor de lacteos:', this.clinicaForm.get('lacteos')?.value);
    console.log('Valor de infusiones:', this.clinicaForm.get('infusiones')?.value);
    console.log('Valor de numero_comidas:', this.clinicaForm.get('numero_comidas')?.value);
    console.log('Valor de alimentacion:', this.clinicaForm.get('alimentacion')?.value);
    console.log('Valor de hidratacion:', this.clinicaForm.get('hidratacion')?.value);
    console.log('Valor de horas_pantalla:', this.clinicaForm.get('horas_pantalla')?.value);
    console.log('Valor de horas_juego_airelibre:', this.clinicaForm.get('horas_juego_airelibre')?.value);
    console.log('Valor de horas_suenio:', this.clinicaForm.get('horas_suenio')?.value);
    console.log('Valor de proyecto:', this.clinicaForm.get('proyecto')?.value);
    console.log('Valor de pcta:', this.clinicaForm.get('pcta')?.value);
    console.log('Valor de pcimc:', this.clinicaForm.get('pcimc')?.value);
    console.log('Valor de imc:', this.clinicaForm.get('imc')?.value);
    console.log('Valor de pct:', this.clinicaForm.get('pct')?.value);
    console.log('Valor de peso:', this.clinicaForm.get('peso')?.value);
    console.log('- - - - - - - - Errores - - - - - - - -');
    // Campos generales
    console.log('Errores en dni:', this.clinicaForm.get('camposGenerales.dni')?.errors);
    console.log('Errores en edad:', this.clinicaForm.get('camposGenerales.edad')?.errors);
    console.log('Errores en obra_social:', this.clinicaForm.get('camposGenerales.obra_social')?.errors);
    console.log('Errores en observaciones:', this.clinicaForm.get('camposGenerales.observaciones')?.errors);
    // Campos especificos
    console.log('Errores en diabetes:', this.clinicaForm.get('diabetes')?.errors);
    console.log('Errores en vacunas:', this.clinicaForm.get('vacunas')?.errors);
    console.log('Errores en talla:', this.clinicaForm.get('talla')?.errors);
    console.log('Errores en cc:', this.clinicaForm.get('cc')?.errors);
    console.log('Errores en estado_nutricional:', this.clinicaForm.get('estado_nutricional')?.errors);
    console.log('Errores en tas:', this.clinicaForm.get('tas')?.errors);
    console.log('Errores en tad:', this.clinicaForm.get('tad')?.errors);
    console.log('Errores en tension_arterial:', this.clinicaForm.get('tension_arterial')?.errors);
    console.log('Errores en examen_visual:', this.clinicaForm.get('examen_visual')?.errors);
    console.log('Errores en ortopedia_traumatologia:', this.clinicaForm.get('ortopedia_traumatologia')?.errors);
    console.log('Errores en segto:', this.clinicaForm.get('segto')?.errors);
    console.log('Errores en lacteos:', this.clinicaForm.get('lacteos')?.errors);
    console.log('Errores en infusiones:', this.clinicaForm.get('infusiones')?.errors);
    console.log('Errores en numero_comidas:', this.clinicaForm.get('numero_comidas')?.errors);
    console.log('Errores en alimentacion:', this.clinicaForm.get('alimentacion')?.errors);
    console.log('Errores en hidratacion:', this.clinicaForm.get('hidratacion')?.errors);
    console.log('Errores en horas_pantalla:', this.clinicaForm.get('diahoras_pantallaetes')?.errors);
    console.log('Errores en horas_juego_airelibre:', this.clinicaForm.get('horas_juego_airelibre')?.errors);
    console.log('Errores en horas_suenio:', this.clinicaForm.get('horas_suenio')?.errors);
    console.log('Errores en proyecto:', this.clinicaForm.get('proyecto')?.errors);
    console.log('Errores en pcta:', this.clinicaForm.get('pcta')?.errors);
    console.log('Errores en pcimc:', this.clinicaForm.get('pcimc')?.errors);
    console.log('Errores en imc:', this.clinicaForm.get('imc')?.errors);
    console.log('Errores en pct:', this.clinicaForm.get('pct')?.errors);
    console.log('Errores en peso:', this.clinicaForm.get('peso')?.errors);
    // Relaciones
    console.log('- - - - - - - - Relaciones - - - - - - - -');
    console.log('Chico: ', this.chico);
    if (this.clinicaForm.valid) {
      Swal.fire({
        title: '¿Cargar nueva consulta clinica?',
        showDenyButton: true,
        confirmButtonColor: '#3f77b4',
        confirmButtonText: 'Confirmar',
        denyButtonText: `Cancelar`,
      }).then((result: any) => {
        if (result.isConfirmed) {
          const data = this.clinicaForm.value;
          /* No hace falta creo:
          this.clinicaForm.get('diabetes')?.setValue(this.clinicaForm.value.diabetes === 'true');
          this.clinicaForm.get('hta')?.setValue(this.clinicaForm.value.hta === 'true');
          this.clinicaForm.get('obesidad')?.setValue(this.clinicaForm.value.obesidad === 'true');
          */
          console.log(data);
          /*
          this._chicoService.cargarChico(data).subscribe({
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
          */
        }
      });
    }
  }
}
