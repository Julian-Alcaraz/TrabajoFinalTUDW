import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { CursoService } from '@services/curso.service';
import { Curso } from '@models/curso.model';
import { LoadingComponent } from '@components/loading/loading.component';
import { IftaLabelModule } from 'primeng/iftalabel';
import { Select } from 'primeng/select';
import { SelectButton } from 'primeng/selectbutton';

@Component({
  selector: 'app-year-grado-form',
  standalone: true,
  imports: [CommonModule, SelectButton, IftaLabelModule, DatePickerModule, Select, ReactiveFormsModule, LoadingComponent],
  templateUrl: './year-grado-form.component.html',
  styleUrl: './year-grado-form.component.css',
})
export class YearGradoFormComponent implements OnInit {
  @Output() cambioForm = new EventEmitter<any>();
  optionForm: FormGroup;
  cursos: Curso[] = [];
  maxDate: Date;
  searchingCursos = false;
  textoBoton = 'Porcentajes';
  porcentajeOptions = [
    { nombre: 'Cantidades', valor: '0' },
    { nombre: 'Porcentajes', valor: '1' },
  ];

  constructor(
    private fb: FormBuilder,
    private _cursoService: CursoService,
  ) {
    this.maxDate = new Date();
    this.optionForm = this.fb.group({
      year: ['', []],
      id_curso: [null, [Validators.required]],
      porcentaje: ['0', [Validators.required]],
    });
  }

  ngOnInit() {
    this.obtenerCursos();
    this.traerDatosGraficos();
  }
  get controlDeInput(): (input: string) => FormControl {
    return (input: string) => this.optionForm.get(input) as FormControl;
  }

  onClickPorcentajes() {
    const porcentaje = this.optionForm.get('porcentaje')?.value;
    if (porcentaje === '1') {
      this.optionForm.get('porcentaje')?.setValue('0');
      this.textoBoton = 'Porcentajes';
    } else if (porcentaje === '0') {
      this.optionForm.get('porcentaje')?.setValue('1');
      this.textoBoton = 'Cantidades';
    }
  }

  obtenerCursos(): any {
    this.searchingCursos = true;
    this._cursoService.obtenerCursos().subscribe({
      next: (response: any) => {
        this.searchingCursos = false;
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
    const porcentaje = this.optionForm.value.porcentaje;
    this.cambioForm.emit({ id_curso, year, nombreCurso, porcentaje });
  }

  resetearForm() {
    this.optionForm.reset();
    this.optionForm.get('porcentaje')?.setValue('0');
    this.optionForm.get('id_curso')?.setValue(null);
    this.traerDatosGraficos();
  }
}
