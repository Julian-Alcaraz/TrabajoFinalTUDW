import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import * as MostrarNotificacion from '../../../utils/notificaciones/mostrar-notificacion';
import { Chico } from '../../../models/chico.model';
import { ChicoService } from '../../../services/chico.service';

@Component({
  selector: 'app-ver-chico',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ver-chico.component.html',
  styleUrl: './ver-chico.component.css',
})
export class VerChicoComponent implements OnInit {
  idChico: number | null = null;
  chico: Chico | null = null;
  mostrarDetalles = false;

  constructor(
    private route: ActivatedRoute,
    private _chicoService: ChicoService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const idChicoParam = params.get('id');
      if (idChicoParam) {
        const parsedId = parseInt(idChicoParam);
        if (!isNaN(parsedId)) {
          this.idChico = parsedId;
          this.obtenerChico(this.idChico);
        } else {
          console.log('El ID proporcionado no es un número válido.');
          // Manejar el caso en que el ID no es un número
        }
      } else {
        console.log('No se proporcionó un ID válido.');
        // Manejar el caso en que no se proporcionó un ID
      }
    });
  }

  obtenerChico(id: number) {
    this._chicoService.obtenerChicoxId(id).subscribe({
      next: (response: any) => {
        if (response.data) {
          this.chico = response.data;
          console.log(this.chico);
          // this.idValido = true;
        }
      },
      error: (err) => {
        MostrarNotificacion.mensajeErrorServicio(this.snackBar, err);
      },
    });
  }

  mostrarDetallesConsulta() {
    this.mostrarDetalles = !this.mostrarDetalles;
    // Aca hay que buscar la consulta en la bd despues
  }
}
