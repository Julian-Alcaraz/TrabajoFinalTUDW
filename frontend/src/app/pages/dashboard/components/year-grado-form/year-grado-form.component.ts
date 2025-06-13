import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { CursoService } from '@services/curso.service';
import { Curso } from '@models/curso.model';
import { LoadingComponent } from '@components/loading/loading.component';
import { IftaLabelModule } from 'primeng/iftalabel';
import { Select } from 'primeng/select';
// import { SelectButton } from 'primeng/selectbutton';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InstitucionService } from '@app/services/institucion.service';
import { Institucion } from '@app/models/institucion.model';

@Component({
  selector: 'app-year-grado-form',
  standalone: true,
  imports: [CommonModule, ButtonModule, IftaLabelModule, DatePickerModule, Select, ReactiveFormsModule, LoadingComponent, RadioButtonModule],
  templateUrl: './year-grado-form.component.html',
  styleUrl: './year-grado-form.component.css',
})
export class YearGradoFormComponent implements OnInit {
  @Input() esTaller?: boolean = false;
  @Output() cambioForm = new EventEmitter<any>();

  optionForm: FormGroup;
  cursos: Curso[] = [];
  instituciones: Institucion[] = [];
  maxDate: Date;
  searchingCursos = false;
  searchingInstituciones = false;
  textoBoton = 'Porcentajes';
  /*
  porcentajeOptions = [
    { nombre: 'Cantidades', valor: '0' },
    { nombre: 'Porcentajes', valor: '1' },
  ];
  */
  constructor(
    private fb: FormBuilder,
    private _cursoService: CursoService,
    private _institucionesService: InstitucionService,
  ) {
    this.maxDate = new Date();
    this.optionForm = this.fb.group({
      year: ['', []],
      id_curso: [null, [Validators.required]],
      id_institucion: [null, [Validators.required]],
      porcentaje: ['0', [Validators.required]],
      participantes: ['0', [Validators.required]],
    });
  }

  ngOnInit() {
    this.obtenerCursos();
    this.obtenerInstituciones();
    this.traerDatosGraficos();
  }
  get controlDeInput(): (input: string) => FormControl {
    return (input: string) => this.optionForm.get(input) as FormControl;
  }
  /*
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
  */
  obtenerInstituciones() {
    this.searchingInstituciones = true;
    this._institucionesService.obtenerInstituciones().subscribe({
      next: (response: any) => {
        this.searchingInstituciones = false;
        this.instituciones = response.data;
      },
      error: (err: any) => {
        console.log(err);
        // MostrarNotificacion.mensajeErrorServicio(this.snackBar, err);
      },
    });
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
    const id_institucion = +this.optionForm.value.id_institucion;
    const year = this.optionForm.value.year ? this.optionForm.value.year.getFullYear() : 0;
    let nombreCurso = '';
    let nombreInstitucion = '';
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
    if (id_institucion) {
      const institucionSeleccionada = this.instituciones.filter((institucion) => {
        if (institucion.id === id_institucion) {
          return institucion;
        } else {
          return;
        }
      });
      nombreInstitucion = institucionSeleccionada[0].nombre;
    }
    const porcentaje = this.optionForm.value.porcentaje;
    if (this.esTaller) {
      const participantes = this.optionForm.value.participantes;
      this.cambioForm.emit({ id_curso, id_institucion, year, nombreCurso, nombreInstitucion, porcentaje, participantes });
    } else {
      this.cambioForm.emit({ id_curso, id_institucion, year, nombreCurso, nombreInstitucion, porcentaje });
    }
  }

  resetearForm() {
    this.optionForm.reset();
    this.optionForm.get('porcentaje')?.setValue('0');
    this.optionForm.get('id_curso')?.setValue(null);
    this.traerDatosGraficos();
  }
}
