import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { CursoService } from '../../../../services/curso.service';
import { Curso } from '../../../../models/curso.model';
import { InputSelectComponent } from '../../../../components/inputs/input-select.component';

@Component({
  selector: 'app-year-grado-form',
  standalone: true,
  imports: [CommonModule, DatePickerModule, InputSelectComponent, ReactiveFormsModule],

  templateUrl: './year-grado-form.component.html',
  styleUrl: './year-grado-form.component.css',
})
export class YearGradoFormComponent implements OnInit {
  @Output() cambioForm = new EventEmitter<any>();
  optionForm: FormGroup;
  cursos: Curso[] = [];
  maxDate: Date;

  constructor(
    private fb: FormBuilder,
    private _cursoService: CursoService,
  ) {
    this.maxDate = new Date();
    this.optionForm = this.fb.group({
      year: ['', []],
      id_curso: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.obtenerCursos();
    this.traerDatosGraficos();
  }

  get controlDeInput(): (input: string) => FormControl {
    return (input: string) => this.optionForm.get(input) as FormControl;
  }

  obtenerCursos(): any {
    this._cursoService.obtenerCursos().subscribe({
      next: (response: any) => {
        this.cursos = response.data;
      },
      error: (err: any) => {
        console.log(err);
        // MostrarNotificacion.mensajeErrorServicio(this.snackBar, err);
      },
    });
  }

  traerDatosGraficos() {
    const id_curso = +this.optionForm.value.id_curso;
    const year = this.optionForm.value.year ? this.optionForm.value.year.getFullYear() : 0;
    let nombreCurso = '';
    if (id_curso) {
      const cursoSeleccionado = this.cursos.filter((curso) => {
        if (curso.id === id_curso) {
          return curso;
        } else {
          return;
        }
      });
      nombreCurso = cursoSeleccionado[0].nombre;
    }
    this.cambioForm.emit({ id_curso, year, nombreCurso });
  }
  resetearForm() {
    this.optionForm.reset();
    this.traerDatosGraficos();
  }
}
