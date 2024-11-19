import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
    this.traerDatosGraficos()
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

  traerDatosGraficos(){
    console.log(this.optionForm.value);
  }
}
