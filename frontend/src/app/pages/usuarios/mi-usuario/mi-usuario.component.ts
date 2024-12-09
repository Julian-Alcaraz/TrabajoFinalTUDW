import { Component, OnInit } from '@angular/core';
import { FormUsuarioComponent } from '../components/form-usuario/form-usuario.component';
import { SessionService } from '@services/session.service';
import { Usuario } from '@models/usuario.model';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { CambiarContraseniaComponent } from '../components/cambioContrasenia/cambio-contrasenia.component';

@Component({
  selector: 'app-mi-usuario',
  standalone: true,
  imports: [FormUsuarioComponent, CommonModule],
  templateUrl: './mi-usuario.component.html',
  styleUrl: './mi-usuario.component.css',
})
export class MiUsuarioComponent implements OnInit {
  public identidad: Usuario | null = null;
  constructor(
    private _sessionService: SessionService,
    private _dialog: MatDialog,
  ) {}
  ngOnInit(): void {
    this.identidad = this._sessionService.getIdentidad();
  }
  abrirModal() {
    this._dialog.open(CambiarContraseniaComponent, { minWidth: '40%' });
  }
}
