import { Component, Inject } from '@angular/core';
import { FormChicosComponent } from '../components/form-chicos/form-chicos.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-editar-chico',
  standalone: true,
  imports: [FormChicosComponent, RouterModule, CommonModule],
  templateUrl: './editar-chico.component.html',
  styleUrl: './editar-chico.component.css',
})
export class EditarChicoComponent {
  public id_chico!: number;

  constructor(
    public dialogRef: MatDialogRef<EditarChicoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.id_chico = data.id;
  }
  cerrarModal(actualizar: boolean) {
    this.dialogRef.close(actualizar);
  }
}
