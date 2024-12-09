import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Usuario } from '@models/usuario.model';
@Component({
  selector: 'app-datos-medico',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-yellow-100 border border-yellow -300 text-sm p-4 rounded-lg w-full md:col-span-6 mt-2">
      <div class="flex flex-col ">
        <div class="font-bold ">Datos del medico</div>
        <div class="flex flex-row gap-4">
          <strong> Nombre Completo: </strong>
          {{ profesional?.nombre }}
          {{ profesional?.apellido }}
          <strong> Dni: </strong>
          {{ profesional?.dni }}
        </div>
      </div>
    </div>
  `,
})
export class DatosMedicoComponent {
  @Input() profesional: Usuario | null = null;
}
