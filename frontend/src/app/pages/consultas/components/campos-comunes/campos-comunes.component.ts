import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, debounceTime, map, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import * as Constantes from '@app/common/const/const';
import * as MostrarNotificacion from '@utils/notificaciones/mostrar-notificacion';
import { ValidarDni, ValidarSoloNumeros } from '@utils/validadores';
import { InputNumberComponent } from '@components/inputs/input-number.component';
import { InputSelectComponent } from '@components/inputs/input-select.component';
import { InputSelectEnumComponent } from '@components/inputs/input-select-enum.component';
import { Chico } from '@models/chico.model';
import { ChicoService } from '@services/chico.service';
import { Institucion } from '@models/institucion.model';
import { InstitucionService } from '@services/institucion.service';
import { Curso } from '@models/curso.model';
import { CursoService } from '@services/curso.service';
import { Consulta } from '@models/consulta.model';
import { LoadingComponent } from '@components/loading/loading.component';

@Component({
  selector: 'app-campos-comunes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputNumberComponent, InputSelectComponent, InputSelectEnumComponent, LoadingComponent],
  templateUrl: './campos-comunes.component.html',
})
export class CamposComunesComponent implements OnInit {
  @Input() form!: FormGroup;
  @Input() values: Consulta | null = null;
  @Input() dni: number | null = null;

  public chico: Chico | null = null;
  public instituciones: Institucion[] = [];
  public cursosOriginales: Curso[] = [];
  public cursos: Curso[] = [];
  public edadAnios: number | null = null;
  public edadMeses: number | null = null;
  public con = Constantes;

  public searching = false;
  public searchingInstituciones = true;
  public searchingCursos = true;

  @Output() chicoChange = new EventEmitter<Chico | null>();

  constructor(
    private snackBar: MatSnackBar,
    private _router: Router,
    private _cursoService: CursoService,
    private _chicoService: ChicoService,
    private _institucionService: InstitucionService,
  ) {}

  actualizarChico(nuevoChico: Chico | null) {
    this.chico = nuevoChico;
    this.chicoChange.emit(this.chico);
  }

  get controlDeInput(): (input: string) => FormControl {
    return (input: string) => this.form.get(input) as FormControl;
  }

  ngOnInit(): void {
    this.obtenerInstituciones();
    this.obtenerCursos();
    this.form.addControl('edad', new FormControl('', [Validators.required, ValidarSoloNumeros]));
    this.form.addControl('dni', new FormControl('', [Validators.required, ValidarSoloNumeros, ValidarDni]));
    this.form.addControl('obra_social', new FormControl('', [Validators.required]));
    this.form.addControl('id_chico', new FormControl(null, [Validators.required]));
    this.form.addControl('id_institucion', new FormControl('', [Validators.required]));
    this.form.addControl('id_curso', new FormControl('', [Validators.required]));
    this.form.addControl('turno', new FormControl('', [Validators.required]));

    this.form.get('dni')?.valueChanges.subscribe(() => {
      this.onChangeDni();
    });

    // si la consulta existe completar los valores con esto
    if (this.values) {
      this.completarCampos();
    }
    if (this.dni) {
      this.form.patchValue({ dni: this.dni });
    }
  }

  onChangeDni() {
    this.chico = null;
    this.actualizarChico(this.chico);
    this.form.get('id_chico')?.setValue(null);
    this.form.get('edad')?.setValue(null);
    this.edadMeses = null;
    this.edadAnios = null;

    const dni = this.form.get('dni')?.value;
    if (!dni || dni.toString().length !== 8) {
      return;
    }
    this.searching = true;
    this._chicoService
      .obtenerChicoxDni(dni)
      .pipe(
        debounceTime(300),
        map((response) => {
          if (response?.success) {
            this.chico = response.data;
            this.actualizarChico(this.chico);
            this.buscarEstudios(this.chico!.dni);
            this.form.get('id_chico')?.setValue(response.data.id);
            this.calcularEdad();
          } else {
            this.chico = null;
            this.actualizarChico(this.chico);
            this.form.get('id_chico')?.setValue(null);
            this.form.get('edad')?.setValue(null);
            this.edadMeses = null;
            this.edadAnios = null;
          }
          this.searching = false;
        }),
        catchError((error) => {
          this.chico = null;
          this.form.get('id_chico')?.setValue(null);
          this.form.get('edad')?.setValue(null);
          this.edadMeses = null;
          this.edadAnios = null;
          this.searching = false;
          console.error('Error al verificar el DNI:', error);
          return of(null);
        }),
      )
      .subscribe();
  }

  buscarEstudios(dni: number) {
    this._chicoService.obtenerUltimosEstudios(dni).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.form.patchValue({
            id_institucion: response.data.id_institucion,
            obra_social: response.data.obra_social,
            turno: response.data.turno,
          });
          // setTimeout
          this.onChangeInstitucion();
          this.form.patchValue({
            id_curso: response.data.id_curso,
          });
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  onChangeInstitucion() {
    this.form.get('id_curso')?.setValue('');
    const idInstitucion = this.form.value.id_institucion;
    const tipoInstitucion = this.instituciones?.find((institucion) => institucion.id === parseInt(idInstitucion))?.tipo;
    const cursosFiltrados = this.cursosOriginales.filter((curso) => curso.nivel === tipoInstitucion);
    this.cursos = cursosFiltrados;
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

  calcularEdad() {
    if (this.chico && this.chico.fe_nacimiento) {
      const nacimiento = new Date(this.chico.fe_nacimiento);
      const hoy = new Date();
      this.edadAnios = hoy.getFullYear() - nacimiento.getFullYear();
      this.edadMeses = hoy.getMonth() - nacimiento.getMonth();
      if (this.edadMeses < 0) {
        this.edadAnios--;
        this.edadMeses += 12;
      }
      this.form.get('edad')?.setValue(this.edadAnios);
    }
  }

  cargarChico() {
    this._router.navigate(['/layout/chicos/nuevo']);
  }

  completarCampos() {
    this.form.patchValue({
      // edad:this.values?.chico?.edad,
      dni: this.values?.chico?.dni,
      obra_social: this.values?.obra_social,
      id_chico: this.values?.chico?.id,
      id_institucion: this.values?.institucion?.id,
      id_curso: this.values?.curso?.id,
      turno: this.values?.turno,
    });
    this.form.disable();
  }
}
