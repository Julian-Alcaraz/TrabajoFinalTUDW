import { Component, ChangeDetectionStrategy } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDialogRef } from '@angular/material/dialog';

import { FormUsuarioComponent } from '../../../usuarios/components/form-usuario/form-usuario.component';

@Component({
  selector: 'app-nuevo-usuario',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [FormUsuarioComponent],
  changeDetection: ChangeDetectionStrategy.Default,
  templateUrl: './nuevo-usuario.component.html',
  styleUrl: './nuevo-usuario.component.css',
})
export class NuevoUsuarioComponent {
  constructor(
    public dialogRef: MatDialogRef<NuevoUsuarioComponent>,
  ) {}

  cerrarModalUsuario(actualizar: boolean) {
    this.dialogRef.close(actualizar);
  }

  onUsuarioCreado() {
    console.log('Usuario creado. Actualizando componente padre.');
    this.cerrarModalUsuario(true);
  }
}
