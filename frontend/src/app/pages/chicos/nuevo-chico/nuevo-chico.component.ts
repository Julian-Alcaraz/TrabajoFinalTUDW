import { Component } from '@angular/core';

import { FormChicosComponent } from '../components/form-chicos/form-chicos.component';

@Component({
  selector: 'app-nuevo-chico',
  standalone: true,
  imports:  [FormChicosComponent],
  templateUrl: './nuevo-chico.component.html',
  styleUrl: './nuevo-chico.component.css'
})
export class NuevoChicoComponent {

}
