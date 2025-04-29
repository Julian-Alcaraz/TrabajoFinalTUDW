import { Component } from '@angular/core';

import { FormChicosComponent } from '../components/form-chicos/form-chicos.component';

@Component({
  selector: 'app-nuevo-chico',
  standalone: true,
  imports: [FormChicosComponent],
  templateUrl: './nuevo-chico.component.html',
})
export class NuevoChicoComponent {}
