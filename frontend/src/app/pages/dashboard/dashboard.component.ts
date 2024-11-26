import { Component } from '@angular/core';
import { GeneralComponent } from './general/general.component';
import { TabsComponent } from '../../components/tabs/tabs.component';
import { ClinicaComponent } from './clinica/clinica.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [GeneralComponent, TabsComponent, ClinicaComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  currentParam: number | null = null;

  escucharParam(value: number) {
    this.currentParam = value;
  }
}
