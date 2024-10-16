import { Component } from '@angular/core';

import { CamposGeneralesComponent } from '../../shared/campos-generales/campos-generales.component';

@Component({
  selector: 'app-nueva-clinica',
  standalone: true,
  imports: [CamposGeneralesComponent],
  templateUrl: './nueva-clinica.component.html',
  styleUrl: './nueva-clinica.component.css'
})
export class NuevaClinicaComponent {

}
