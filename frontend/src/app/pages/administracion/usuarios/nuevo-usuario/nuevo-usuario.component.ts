import { Component, ChangeDetectionStrategy } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
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
  constructor(private snackBar: MatSnackBar) {}
}
