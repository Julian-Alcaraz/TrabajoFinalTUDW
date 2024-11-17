import { Component } from '@angular/core';
import { GeneralComponent } from './components/general/general.component';
import { TabsComponent } from '../../components/tabs/tabs.component';
import { ClinicaComponent } from './components/clinica/clinica.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [GeneralComponent, TabsComponent, ClinicaComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  currentParam: number | null = null;

  escucharParam(value: number) {
    this.currentParam = value;
  }
}
