import * as MostrarNotificacion from '../../../../utils/notificaciones/mostrar-notificacion';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { InputNumberComponent } from '../input-number/input-number.component';
import { InputTextComponent } from '../input-text/input-text.component';
import { InputSelectComponent } from '../input-select/input-select.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { InputTextareaComponent } from '../input-textarea/input-textarea.component';
import { ValidarCadenaSinEspacios, ValidarCampoOpcional, ValidarDni, ValidarSoloLetras, ValidarSoloNumeros } from '../../../../utils/validadores';
import { ChicoService } from '../../../../services/chico.service';
import { catchError, debounceTime, map, of } from 'rxjs';
import { Chico } from '../../../../models/chico.model';
import { Institucion } from '../../../../models/institucion.model';
import { Curso } from '../../../../models/curso.model';
import { CursoService } from '../../../../services/curso.service';
import { InstitucionService } from '../../../../services/institucion.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-campos-comunes',
  standalone: true,
  imports: [CommonModule, InputNumberComponent, InputTextComponent, InputSelectComponent, InputTextareaComponent],
  templateUrl: './campos-comunes.component.html',
  styleUrl: './campos-comunes.component.css',
})
export class CamposComunesComponent implements OnInit {
  @Input() form!: FormGroup;

  public chico: Chico | null = null;
  public instituciones: Institucion[] = [];
  public cursos: Curso[] = [];

  constructor(
    private snackBar: MatSnackBar,
    private _cursoService: CursoService,
    private _chicoService: ChicoService,
    private _institucionService: InstitucionService,
  ) {}

  get controlDeInput(): (input: string) => FormControl {
    return (input: string) => this.form.get(input) as FormControl;
  }

  ngOnInit(): void {
    this.obtenerInstituciones();
    this.obtenerCursos();
    
    this.form.addControl('edad', new FormControl(1, [Validators.required, ValidarSoloNumeros]));
    this.form.addControl('dni', new FormControl(12345678, [Validators.required, ValidarSoloNumeros, ValidarDni]));
    this.form.addControl('obra_social', new FormControl('', [ValidarCampoOpcional(Validators.minLength(3), Validators.maxLength(100), ValidarCadenaSinEspacios, ValidarSoloLetras)]));
    this.form.addControl('observaciones', new FormControl('', [ValidarCampoOpcional(Validators.minLength(1), Validators.maxLength(1000), ValidarCadenaSinEspacios, ValidarSoloLetras)]));
    this.form.addControl('chicoParam', new FormControl(null, [Validators.required]));
    this.form.addControl('id_institucion', new FormControl('', [Validators.required]));
    this.form.addControl('id_curso', new FormControl('', [Validators.required]));

    this.form.get('dni')?.valueChanges.subscribe(() => {
      this.onChangeDni();
    });
  }

  onChangeDni() {
    const dni = this.form.get('dni')?.value;
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
            console.log('Chico encontrado: ', this.form.get('chicoParam')?.value);
          } else {
            this.chico = null;
            this.form.get('chicoParam')?.setValue(null);
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
}
