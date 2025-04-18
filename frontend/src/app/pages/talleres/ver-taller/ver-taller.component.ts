import { Component, Inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { FormTallerComponent } from '../components/form-taller/form-taller.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-ver-taller',
  standalone: true,
  imports: [FormTallerComponent, RouterModule, CommonModule],
  templateUrl: './ver-taller.component.html',
  styleUrl: './ver-taller.component.css',
})
export class VerTallerComponent {
  public id_taller!: number;

  constructor(
    public dialogRef: MatDialogRef<VerTallerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.id_taller = data.id;
  }

  cerrarModal(actualizar: boolean) {
    this.dialogRef.close(actualizar);
  }
}
