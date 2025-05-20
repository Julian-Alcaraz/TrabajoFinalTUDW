import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Categoria } from '@app/models/categoria.model';
import { CategoriaService } from '@app/services/categoria.service';
import { IftaLabelModule } from 'primeng/iftalabel';
import { SelectModule } from 'primeng/select';
import * as MostrarNotificacion from '@utils/notificaciones/mostrar-notificacion';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
  selector: 'app-campos-social',
  standalone: true,
  imports: [IftaLabelModule, ReactiveFormsModule, SelectModule, MultiSelectModule],

  templateUrl: './campos-social.component.html',
})
export class CamposSocialComponent implements OnInit {
  @Input() form!: FormGroup;

  public loadingCategorias = false;
  public especificas!: FormGroup;
  public categorias: Categoria[] = [];

  public derivacionesOptions: any[] = [
    { nombre: 'Si', valor: { externa: true } },
    { nombre: 'No', valor: { externa: false } },
  ];

  constructor(
    private _categoriaService: CategoriaService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.obtenerCategorias();
    this.especificas = new FormGroup({
      categoriasSeleccionadas: new FormControl(),
      // Oftalmologia
      derivaciones: new FormControl(),
    });
    this.form.addControl('especificas', this.especificas);
  }

  obtenerCategorias() {
    this.loadingCategorias = true;
    this._categoriaService.obtenerCategorias().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.categorias = response.data;
        }
        this.loadingCategorias = false;
      },
      error: (err: any) => {
        MostrarNotificacion.mensajeErrorServicio(this.snackBar, err);
        this.loadingCategorias = false;
      },
    });
  }

  get controlDeInput(): (input: string) => FormControl {
    return (input: string) => this.form.get(input) as FormControl;
  }
}
