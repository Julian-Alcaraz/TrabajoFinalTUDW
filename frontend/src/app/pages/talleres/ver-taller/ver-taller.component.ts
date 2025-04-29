import { Component, Inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { FormTallerComponent } from '../components/form-taller/form-taller.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Taller } from '@app/models/taller.model';

@Component({
  selector: 'app-ver-taller',
  standalone: true,
  imports: [FormTallerComponent, RouterModule, CommonModule],
  templateUrl: './ver-taller.component.html',
})
export class VerTallerComponent {
  public taller!: Taller;

  constructor(
    public dialogRef: MatDialogRef<VerTallerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.taller = data.taller;
  }

  cerrarModal(actualizar: boolean) {
    this.dialogRef.close(actualizar);
  }
}
